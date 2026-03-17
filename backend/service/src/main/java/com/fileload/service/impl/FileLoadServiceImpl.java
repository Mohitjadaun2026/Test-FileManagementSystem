package com.fileload.service.impl;

import com.fileload.dao.repository.FileLoadRepository;
import com.fileload.dao.specification.FileLoadSpecifications;
import com.fileload.model.dto.FileLoadResponseDTO;
import com.fileload.model.dto.SearchCriteriaDTO;
import com.fileload.model.dto.UpdateMetadataRequestDTO;
import com.fileload.model.entity.FileLoad;
import com.fileload.model.entity.FileStatus;
import com.fileload.service.FileLoadService;
import com.fileload.service.mapper.FileLoadMapper;
import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileLoadServiceImpl implements FileLoadService {

    private final FileLoadRepository fileLoadRepository;
    private final FileLoadMapper fileLoadMapper;
    private final JobLauncher jobLauncher;
    private final Job fileProcessingJob;

    public FileLoadServiceImpl(FileLoadRepository fileLoadRepository,
                               FileLoadMapper fileLoadMapper,
                               JobLauncher jobLauncher,
                               Job fileProcessingJob) {
        this.fileLoadRepository = fileLoadRepository;
        this.fileLoadMapper = fileLoadMapper;
        this.jobLauncher = jobLauncher;
        this.fileProcessingJob = fileProcessingJob;
    }

    @Override
    @Transactional
    public FileLoadResponseDTO createFileLoad(MultipartFile file) {
        try {
            Path uploadsDir = Path.of("uploads");
            Files.createDirectories(uploadsDir);
            String originalFilename = normalizeOriginalFilename(file.getOriginalFilename());
            Path savedFile = resolveUniquePath(uploadsDir, originalFilename);
            Files.copy(file.getInputStream(), savedFile, StandardCopyOption.REPLACE_EXISTING);

            FileLoad entity = new FileLoad();
            entity.setFilename(originalFilename);
            entity.setFileType(file.getContentType() == null ? "application/octet-stream" : file.getContentType());
            entity.setFileSize(file.getSize());
            entity.setLoadDate(LocalDateTime.now());
            entity.setStatus(FileStatus.PENDING);
            entity.setRecordCount(0L);
            entity.setArchived(false);
            entity.setStoragePath(savedFile.toAbsolutePath().toString());

            FileLoad saved = fileLoadRepository.save(entity);
            launchBatch(saved.getId());
            return fileLoadMapper.toDto(saved);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to store uploaded file", ex);
        }
    }

    private String normalizeOriginalFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.isBlank()) {
            return "uploaded-file";
        }

        String cleaned = Path.of(originalFilename).getFileName().toString().trim();
        if (cleaned.isBlank()) {
            return "uploaded-file";
        }
        return cleaned;
    }

    private Path resolveUniquePath(Path uploadsDir, String originalFilename) {
        Path candidate = uploadsDir.resolve(originalFilename);
        if (!Files.exists(candidate)) {
            return candidate;
        }

        int dotIndex = originalFilename.lastIndexOf('.');
        String base = dotIndex > 0 ? originalFilename.substring(0, dotIndex) : originalFilename;
        String ext = dotIndex > 0 ? originalFilename.substring(dotIndex) : "";

        int counter = 1;
        while (true) {
            Path next = uploadsDir.resolve(base + "-" + counter + ext);
            if (!Files.exists(next)) {
                return next;
            }
            counter++;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public FileLoadResponseDTO getFileLoadById(Long id) {
        FileLoad entity = fetchById(id);
        return fileLoadMapper.toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FileLoadResponseDTO> searchFileLoads(SearchCriteriaDTO criteria) {
        String[] sortTokens = criteria.getSort().split(",");
        String sortField = sortTokens[0];
        Sort.Direction direction = sortTokens.length > 1 && "asc".equalsIgnoreCase(sortTokens[1])
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize(), Sort.by(direction, mapSort(sortField)));
        return fileLoadRepository.findAll(FileLoadSpecifications.withCriteria(criteria), pageable)
                .map(fileLoadMapper::toDto);
    }

    @Override
    @Transactional
    public FileLoadResponseDTO updateFileLoadStatus(Long id, String status, String comment) {
        FileLoad entity = fetchById(id);
        entity.setStatus(FileStatus.valueOf(status.toUpperCase()));
        if (comment != null && !comment.isBlank()) {
            entity.setErrors(comment);
        }
        return fileLoadMapper.toDto(fileLoadRepository.save(entity));
    }

    @Override
    @Transactional
    public FileLoadResponseDTO updateMetadata(Long id, UpdateMetadataRequestDTO request) {
        FileLoad entity = fetchById(id);
        entity.setDescription(request.getDescription());
        if (request.getTags() != null) {
            String tagCsv = request.getTags().stream()
                    .filter(tag -> tag != null && !tag.isBlank())
                    .map(String::trim)
                    .collect(Collectors.joining(","));
            entity.setTags(tagCsv);
        }
        return fileLoadMapper.toDto(fileLoadRepository.save(entity));
    }

    @Override
    @Transactional
    public void deleteFileLoad(Long id) {
        FileLoad entity = fetchById(id);
        if (entity.getStoragePath() != null) {
            try {
                Files.deleteIfExists(Path.of(entity.getStoragePath()));
            } catch (IOException ignored) {
            }
        }
        fileLoadRepository.delete(entity);
    }

    @Override
    @Transactional
    public FileLoadResponseDTO archiveFileLoad(Long id) {
        FileLoad entity = fetchById(id);
        entity.setArchived(true);
        entity.setStatus(FileStatus.ARCHIVED);
        return fileLoadMapper.toDto(fileLoadRepository.save(entity));
    }

    @Override
    @Transactional
    public FileLoadResponseDTO retryFileLoad(Long id) {
        FileLoad entity = fetchById(id);
        entity.setStatus(FileStatus.PENDING);
        entity.setErrors(null);
        entity = fileLoadRepository.save(entity);
        launchBatch(entity.getId());
        return fileLoadMapper.toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadFile(Long id) {
        FileLoad entity = fetchById(id);
        try {
            return Files.readAllBytes(Path.of(entity.getStoragePath()));
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to read file", ex);
        }
    }

    private FileLoad fetchById(Long id) {
        return fileLoadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("File load not found: " + id));
    }

    private String mapSort(String sortField) {
        return switch (sortField) {
            case "uploadDate" -> "loadDate";
            case "filename", "id", "status", "recordCount" -> sortField;
            default -> "loadDate";
        };
    }

    private void launchBatch(Long fileLoadId) {
        try {
            JobParameters params = new JobParametersBuilder()
                    .addLong("fileLoadId", fileLoadId)
                    .addLong("startAt", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(fileProcessingJob, params);
        } catch (Exception ex) {
            FileLoad entity = fetchById(fileLoadId);
            entity.setStatus(FileStatus.FAILED);
            entity.setErrors(ex.getMessage());
            fileLoadRepository.save(entity);
        }
    }
}



