package com.fileload.dao.specification;

import com.fileload.model.dto.SearchCriteriaDTO;
import com.fileload.model.entity.FileLoad;
import com.fileload.model.entity.FileStatus;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class FileLoadSpecifications {

    private FileLoadSpecifications() {
    }

    public static Specification<FileLoad> withCriteria(SearchCriteriaDTO criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isFalse(root.get("archived")));

            if (criteria.getFileId() != null) {
                predicates.add(cb.equal(root.get("id"), criteria.getFileId()));
            }
            if (criteria.getFilename() != null && !criteria.getFilename().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("filename")), "%" + criteria.getFilename().toLowerCase() + "%"));
            }
            if (criteria.getUploadedById() != null) {
                predicates.add(cb.equal(root.get("uploadedById"), criteria.getUploadedById()));
            }
            if (criteria.getStatus() != null && !criteria.getStatus().isBlank()) {
                predicates.add(cb.equal(root.get("status"), FileStatus.valueOf(criteria.getStatus().toUpperCase())));
            }
            if (criteria.getStartDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("loadDate"), criteria.getStartDate()));
            }
            if (criteria.getEndDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("loadDate"), criteria.getEndDate()));
            }
            if (criteria.getRecordCountMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("recordCount"), criteria.getRecordCountMin()));
            }
            if (criteria.getRecordCountMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("recordCount"), criteria.getRecordCountMax()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

