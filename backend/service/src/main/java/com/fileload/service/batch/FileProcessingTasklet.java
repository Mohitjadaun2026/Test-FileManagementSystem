package com.fileload.service.batch;

import com.fileload.dao.repository.FileLoadRepository;
import com.fileload.model.entity.FileLoad;
import com.fileload.model.entity.FileStatus;
import com.fileload.service.util.RecordCountUtil;
import java.nio.file.Path;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class FileProcessingTasklet implements Tasklet {

    private final FileLoadRepository fileLoadRepository;
    private final RecordCountUtil recordCountUtil;

    public FileProcessingTasklet(FileLoadRepository fileLoadRepository, RecordCountUtil recordCountUtil) {
        this.fileLoadRepository = fileLoadRepository;
        this.recordCountUtil = recordCountUtil;
    }

    @Override
    @Transactional
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        Long fileLoadId = Long.valueOf(
                chunkContext.getStepContext().getJobParameters().get("fileLoadId").toString()
        );

        FileLoad fileLoad = fileLoadRepository.findById(fileLoadId)
                .orElseThrow(() -> new IllegalArgumentException("File load not found: " + fileLoadId));

        fileLoad.setStatus(FileStatus.PROCESSING);
        fileLoadRepository.save(fileLoad);

        try {
            long count = recordCountUtil.countRecords(Path.of(fileLoad.getStoragePath()));
            fileLoad.setRecordCount(count);
            fileLoad.setErrors(null);
            fileLoad.setStatus(FileStatus.SUCCESS);
        } catch (Exception ex) {
            fileLoad.setStatus(FileStatus.FAILED);
            fileLoad.setErrors(ex.getMessage());
        }

        fileLoadRepository.save(fileLoad);
        return RepeatStatus.FINISHED;
    }
}

