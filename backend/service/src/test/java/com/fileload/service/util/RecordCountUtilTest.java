package com.fileload.service.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

class RecordCountUtilTest {

    private final RecordCountUtil recordCountUtil = new RecordCountUtil();

    @TempDir
    Path tempDir;

    @Test
    void shouldCountCsvRecordsWithoutErrors() throws Exception {
        Path file = tempDir.resolve("valid.csv");
        Files.writeString(file, "id,name\n1,Alice\n2,Bob\n");

        RecordCountUtil.ProcessingResult result = recordCountUtil.analyzeFile(file);

        assertEquals(2L, result.recordCount());
        assertFalse(result.hasErrors());
    }

    @Test
    void shouldFailWhenCsvColumnCountIsInconsistent() throws Exception {
        Path file = tempDir.resolve("invalid-columns.csv");
        Files.writeString(file, "id,name,city\n1,Alice,Delhi\n2,Bob\n");

        RecordCountUtil.ProcessingResult result = recordCountUtil.analyzeFile(file);

        assertEquals(2L, result.recordCount());
        assertTrue(result.hasErrors());
        assertTrue(result.errorMessage().contains("columns"));
    }

    @Test
    void shouldFailWhenCsvHasUnbalancedQuotes() throws Exception {
        Path file = tempDir.resolve("invalid-quotes.csv");
        Files.writeString(file, "id,name\n1,\"Alice\n2,Bob\n");

        RecordCountUtil.ProcessingResult result = recordCountUtil.analyzeFile(file);

        assertTrue(result.hasErrors());
        assertTrue(result.errorMessage().toLowerCase().contains("quotes"));
    }
}

