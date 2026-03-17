package com.fileload.model.dto;

import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

public class SearchCriteriaDTO {

    private Long fileId;
    private String filename;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long recordCountMin;
    private Long recordCountMax;

    @Min(0)
    private Integer page = 0;

    @Min(1)
    private Integer size = 10;

    private String sort = "loadDate,desc";

    public Long getFileId() {
        return fileId;
    }

    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Long getRecordCountMin() {
        return recordCountMin;
    }

    public void setRecordCountMin(Long recordCountMin) {
        this.recordCountMin = recordCountMin;
    }

    public Long getRecordCountMax() {
        return recordCountMax;
    }

    public void setRecordCountMax(Long recordCountMax) {
        this.recordCountMax = recordCountMax;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }
}

