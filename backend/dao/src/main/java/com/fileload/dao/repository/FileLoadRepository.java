package com.fileload.dao.repository;

import com.fileload.model.entity.FileLoad;
import com.fileload.model.entity.FileStatus;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FileLoadRepository extends JpaRepository<FileLoad, Long>, JpaSpecificationExecutor<FileLoad> {

	long countByStatus(FileStatus status);

	long countByStatusAndLoadDateBetween(FileStatus status, LocalDateTime start, LocalDateTime end);

	long countByLoadDateBetween(LocalDateTime start, LocalDateTime end);
}

