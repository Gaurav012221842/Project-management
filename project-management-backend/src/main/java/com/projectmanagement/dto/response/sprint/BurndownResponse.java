package com.projectmanagement.dto.response.sprint;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class BurndownResponse {
    private String sprintId;
    private String sprintName;
    private int totalStoryPoints;
    private List<BurndownEntry> entries;

    @Data
    @Builder
    public static class BurndownEntry {
        private LocalDate date;
        private int remainingPoints;
        private int idealPoints;
    }
}
