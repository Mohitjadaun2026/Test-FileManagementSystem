package com.fileload.model.dto;

import java.util.List;

public class UpdateMetadataRequestDTO {

    private String description;
    private List<String> tags;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
}

