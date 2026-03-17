package com.fileload.service;

import com.fileload.model.dto.FileLoadResponseDTO;
import com.fileload.model.dto.SearchCriteriaDTO;
import com.fileload.model.dto.UpdateMetadataRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface FileLoadService {

    FileLoadResponseDTO createFileLoad(MultipartFile file);

    FileLoadResponseDTO getFileLoadById(Long id);

    Page<FileLoadResponseDTO> searchFileLoads(SearchCriteriaDTO criteria);

    FileLoadResponseDTO updateFileLoadStatus(Long id, String status, String comment);

    FileLoadResponseDTO updateMetadata(Long id, UpdateMetadataRequestDTO request);

    void deleteFileLoad(Long id);

    FileLoadResponseDTO archiveFileLoad(Long id);

    FileLoadResponseDTO retryFileLoad(Long id);

    byte[] downloadFile(Long id);
}


