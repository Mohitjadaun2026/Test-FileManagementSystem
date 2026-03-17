package com.fileload.service.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RecordCountUtil {

    public long countRecords(Path filePath) throws IOException {
        String fileName = filePath.getFileName().toString().toLowerCase();
        String content = Files.readString(filePath, StandardCharsets.UTF_8);

        if (fileName.endsWith(".csv")) {
            return countCsvRows(content);
        }

        if (fileName.endsWith(".txt") || fileName.endsWith(".xml")) {
            return content.lines().filter(line -> !line.isBlank()).count();
        }

        return 0;
    }

    private long countCsvRows(String content) {
        List<String> rows = splitCsvRows(content);
        if (rows.isEmpty()) {
            return 0;
        }
        if (rows.size() > 1 && hasHeader(rows.get(0), rows.get(1))) {
            return rows.size() - 1L;
        }
        return rows.size();
    }

    private List<String> splitCsvRows(String content) {
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
        return rows;
    }

    private boolean hasHeader(String firstRow, String secondRow) {
        String[] first = firstRow.split(",");
        String[] second = secondRow.split(",");
        if (first.length != second.length || first.length == 0) {
            return false;
        }

        int matches = 0;
        for (int i = 0; i < first.length; i++) {
            if (!isNumeric(first[i].trim()) && isNumeric(second[i].trim())) {
                matches++;
            }
        }
        return matches >= Math.max(1, first.length / 2);
    }

    private boolean isNumeric(String value) {
        return value.matches("[-+]?\\d+(\\.\\d+)?");
    }
}

