package com.fileload.service.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RecordCountUtil {

    public ProcessingResult analyzeFile(Path filePath) throws IOException {
        String fileName = filePath.getFileName().toString().toLowerCase();
        String content = Files.readString(filePath, StandardCharsets.UTF_8);

        if (fileName.endsWith(".csv")) {
            return analyzeCsv(content);
        }

        if (fileName.endsWith(".txt") || fileName.endsWith(".xml")) {
            long count = content.lines().filter(line -> !line.isBlank()).count();
            return ProcessingResult.success(count);
        }

        return ProcessingResult.success(0);
    }

    public long countRecords(Path filePath) throws IOException {
        return analyzeFile(filePath).recordCount();
    }

    private ProcessingResult analyzeCsv(String content) {
        CsvReadResult csv = splitCsvRows(content);
        List<String> rows = csv.rows();
        List<String> errors = new ArrayList<>();

        if (csv.unbalancedQuotes()) {
            errors.add("CSV contains unbalanced quotes.");
        }

        if (rows.isEmpty()) {
            return errors.isEmpty() ? ProcessingResult.success(0) : ProcessingResult.failed(0, errors);
        }

        int dataStartIndex = rows.size() > 1 && hasHeader(rows.get(0), rows.get(1)) ? 1 : 0;
        long recordCount = rows.size() - dataStartIndex;

        if (recordCount > 0) {
            int expectedColumns = splitCsvCells(rows.get(dataStartIndex)).size();
            for (int i = dataStartIndex; i < rows.size(); i++) {
                int actualColumns = splitCsvCells(rows.get(i)).size();
                if (actualColumns != expectedColumns) {
                    errors.add("Line " + (i + 1) + " has " + actualColumns
                            + " columns, expected " + expectedColumns + ".");
                }
            }
        }

        return errors.isEmpty() ? ProcessingResult.success(recordCount) : ProcessingResult.failed(recordCount, errors);
    }

    private CsvReadResult splitCsvRows(String content) {
        List<String> rows = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < content.length(); i++) {
            char c = content.charAt(i);
            char next = i + 1 < content.length() ? content.charAt(i + 1) : '\0';

            if (c == '"') {
                if (inQuotes && next == '"') {
                    current.append(c);
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (c == '\r') {
                continue;
            }

            if (c == '\n' && !inQuotes) {
                String row = current.toString().trim();
                if (!row.isEmpty()) {
                    rows.add(row);
                }
                current.setLength(0);
                continue;
            }

            current.append(c);
        }

        String tail = current.toString().trim();
        if (!tail.isEmpty()) {
            rows.add(tail);
        }
        return new CsvReadResult(rows, inQuotes);
    }

    private List<String> splitCsvCells(String row) {
        List<String> cells = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < row.length(); i++) {
            char c = row.charAt(i);
            char next = i + 1 < row.length() ? row.charAt(i + 1) : '\0';

            if (c == '"') {
                if (inQuotes && next == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (c == ',' && !inQuotes) {
                cells.add(current.toString().trim());
                current.setLength(0);
                continue;
            }

            current.append(c);
        }

        cells.add(current.toString().trim());
        return cells;
    }

    private boolean hasHeader(String firstRow, String secondRow) {
        List<String> first = splitCsvCells(firstRow);
        List<String> second = splitCsvCells(secondRow);
        if (first.size() != second.size() || first.isEmpty()) {
            return false;
        }

        int matches = 0;
        for (int i = 0; i < first.size(); i++) {
            if (!isNumeric(first.get(i)) && isNumeric(second.get(i))) {
                matches++;
            }
        }
        return matches >= Math.max(1, first.size() / 2);
    }

    private boolean isNumeric(String value) {
        return value.matches("[-+]?\\d+(\\.\\d+)?");
    }

    private record CsvReadResult(List<String> rows, boolean unbalancedQuotes) {
    }

    public static final class ProcessingResult {
        private final long recordCount;
        private final List<String> errors;

        private ProcessingResult(long recordCount, List<String> errors) {
            this.recordCount = recordCount;
            this.errors = errors;
        }

        public static ProcessingResult success(long recordCount) {
            return new ProcessingResult(recordCount, Collections.emptyList());
        }

        public static ProcessingResult failed(long recordCount, List<String> errors) {
            return new ProcessingResult(recordCount, List.copyOf(errors));
        }

        public long recordCount() {
            return recordCount;
        }

        public boolean hasErrors() {
            return !errors.isEmpty();
        }

        public String errorMessage() {
            return String.join(" ", errors);
        }
    }
}

