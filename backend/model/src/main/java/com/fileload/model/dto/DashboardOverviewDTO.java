package com.fileload.model.dto;

import java.time.LocalDateTime;

public class DashboardOverviewDTO {

    private long totalUploads;
    private long inProcessing;
    private double successRate;
    private long exceptionsToday;
    private long pendingCount;
    private long processingCount;
    private long successCount;
    private LocalDateTime lastUpdated;

    public long getTotalUploads() {
        return totalUploads;
    }

    public void setTotalUploads(long totalUploads) {
        this.totalUploads = totalUploads;
    }

    public long getInProcessing() {
        return inProcessing;
    }

    public void setInProcessing(long inProcessing) {
        this.inProcessing = inProcessing;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }

    public long getExceptionsToday() {
        return exceptionsToday;
    }

    public void setExceptionsToday(long exceptionsToday) {
        this.exceptionsToday = exceptionsToday;
    }

    public long getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(long pendingCount) {
        this.pendingCount = pendingCount;
    }

    public long getProcessingCount() {
        return processingCount;
    }

    public void setProcessingCount(long processingCount) {
        this.processingCount = processingCount;
    }

    public long getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(long successCount) {
        this.successCount = successCount;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}

