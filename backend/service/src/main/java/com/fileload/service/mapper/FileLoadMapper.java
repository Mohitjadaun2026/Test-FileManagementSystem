package com.fileload.service.mapper;

import com.fileload.model.dto.FileLoadResponseDTO;
import com.fileload.model.entity.FileLoad;
import java.util.Arrays;
import java.util.Collections;
import org.springframework.stereotype.Component;

@Component
public class FileLoadMapper {

    public FileLoadResponseDTO toDto(FileLoad entity) {
        FileLoadResponseDTO dto = new FileLoadResponseDTO();
        dto.setId(entity.getId());
        dto.setFilename(entity.getFilename());
        dto.setFileType(entity.getFileType());
        dto.setFileSize(entity.getFileSize());
        dto.setStatus(entity.getStatus().name());
        dto.setRecordCount(entity.getRecordCount());
        dto.setErrors(entity.getErrors());
        dto.setUploadDate(entity.getLoadDate());
        dto.setDescription(entity.getDescription());
        dto.setTags(entity.getTags() == null || entity.getTags().isBlank()
                ? Collections.emptyList()
                : Arrays.stream(entity.getTags().split(","))
                .map(String::trim)
                .filter(tag -> !tag.isBlank())
                .toList());
        return dto;
    }
}


