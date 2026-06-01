package com.projectmanagement.dto.response.ai;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AISubTasksResponse {
    private List<SubTaskSuggestion> subTasks;
    private Integer estimatedTotalTime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubTaskSuggestion {
        private String  title;
        private String  description;
        private Integer estimatedHours;
        private String  priority;
    }
}