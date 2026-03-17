package com.fileload.dao.repository;

import com.fileload.model.entity.FileLoad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FileLoadRepository extends JpaRepository<FileLoad, Long>, JpaSpecificationExecutor<FileLoad> {
}

