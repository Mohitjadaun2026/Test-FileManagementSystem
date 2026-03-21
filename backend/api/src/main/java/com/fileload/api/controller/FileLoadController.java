package com.fileload.api.controller;

import com.fileload.model.dto.DashboardOverviewDTO;
import com.fileload.model.dto.FileLoadResponseDTO;
import com.fileload.model.dto.SearchCriteriaDTO;
import com.fileload.model.dto.UpdateMetadataRequestDTO;
import com.fileload.model.dto.UpdateStatusRequestDTO;
import com.fileload.service.FileLoadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import org.springframework.data.domain.Page;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file-loads")
@Tag(name = "File Loads")
public class FileLoadController {

    private final FileLoadService fileLoadService;

    public FileLoadController(FileLoadService fileLoadService) {
        this.fileLoadService = fileLoadService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Create new file load")
    public ResponseEntity<FileLoadResponseDTO> createFileLoad(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fileLoadService.createFileLoad(file));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Get file load by id")
    public ResponseEntity<FileLoadResponseDTO> getFileLoad(@PathVariable Long id) {
        return ResponseEntity.ok(fileLoadService.getFileLoadById(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Search file loads")
    public ResponseEntity<Page<FileLoadResponseDTO>> searchFileLoads(
            @RequestParam(required = false) Long fileId,
            @RequestParam(required = false) String filename,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long recordCountMin,
            @RequestParam(required = false) Long recordCountMax,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "uploadDate,desc") String sort
    ) {
        SearchCriteriaDTO criteria = buildSearchCriteria(fileId, filename, status, startDate, endDate,
                recordCountMin, recordCountMax, page, size, sort);
        return ResponseEntity.ok(fileLoadService.searchFileLoads(criteria));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Search current user's file loads")
    public ResponseEntity<Page<FileLoadResponseDTO>> searchMyFileLoads(
            @RequestParam(required = false) Long fileId,
            @RequestParam(required = false) String filename,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long recordCountMin,
            @RequestParam(required = false) Long recordCountMax,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "uploadDate,desc") String sort
    ) {
        SearchCriteriaDTO criteria = buildSearchCriteria(fileId, filename, status, startDate, endDate,
                recordCountMin, recordCountMax, page, size, sort);
        return ResponseEntity.ok(fileLoadService.searchMyFileLoads(criteria));
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Get live dashboard overview metrics")
    public ResponseEntity<DashboardOverviewDTO> getDashboardOverview() {
        return ResponseEntity.ok(fileLoadService.getDashboardOverview());
    }

    private SearchCriteriaDTO buildSearchCriteria(Long fileId,
                                                  String filename,
                                                  String status,
                                                  String startDate,
                                                  String endDate,
                                                  Long recordCountMin,
                                                  Long recordCountMax,
                                                  Integer page,
                                                  Integer size,
                                                  String sort) {
        SearchCriteriaDTO criteria = new SearchCriteriaDTO();
        criteria.setFileId(fileId);
        criteria.setFilename(filename);
        criteria.setStatus(status);
        criteria.setStartDate(parseDateTime(startDate));
        criteria.setEndDate(parseDateTime(endDate));
        criteria.setRecordCountMin(recordCountMin);
        criteria.setRecordCountMax(recordCountMax);
        criteria.setPage(page);
        criteria.setSize(size);
        criteria.setSort(sort);
        return criteria;
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return LocalDateTime.parse(value);
        } catch (DateTimeParseException ignored) {
        }

        try {
            return OffsetDateTime.parse(value).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
        }

        try {
            return Instant.parse(value).atZone(ZoneId.systemDefault()).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
        }

        try {
            return java.time.LocalDate.parse(value).atStartOfDay();
        } catch (DateTimeParseException ignored) {
        }

        throw new IllegalArgumentException("Invalid date format: " + value);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update file status")
    public ResponseEntity<FileLoadResponseDTO> updateStatus(@PathVariable Long id,
                                                            @Valid @RequestBody UpdateStatusRequestDTO request) {
        return ResponseEntity.ok(fileLoadService.updateFileLoadStatus(id, request.getStatus(), request.getComment()));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Update file metadata")
    public ResponseEntity<FileLoadResponseDTO> updateMetadata(@PathVariable Long id,
                                                              @RequestBody UpdateMetadataRequestDTO request) {
        return ResponseEntity.ok(fileLoadService.updateMetadata(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete file load")
    public ResponseEntity<Void> deleteFileLoad(@PathVariable Long id) {
        fileLoadService.deleteFileLoad(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Archive file load")
    public ResponseEntity<FileLoadResponseDTO> archiveFileLoad(@PathVariable Long id) {
        return ResponseEntity.ok(fileLoadService.archiveFileLoad(id));
    }

    @PostMapping("/{id}/retry")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Retry failed file load")
    public ResponseEntity<FileLoadResponseDTO> retryFileLoad(@PathVariable Long id) {
        return ResponseEntity.ok(fileLoadService.retryFileLoad(id));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @Operation(summary = "Download original file")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        FileLoadResponseDTO dto = fileLoadService.getFileLoadById(id);
        byte[] data = fileLoadService.downloadFile(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(ContentDisposition.attachment().filename(dto.getFilename()).build());
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return new ResponseEntity<>(data, headers, HttpStatus.OK);
    }
}


