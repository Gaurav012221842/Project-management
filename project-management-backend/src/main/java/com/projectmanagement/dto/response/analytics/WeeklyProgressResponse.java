package com.projectmanagement.dto.response.analytics;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyProgressResponse {

    private List<WeekData> weeks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeekData {
        private String week;
        private String dateRange;
        private Integer tasksCreated;
        private Integer tasksCompleted;
        private Integer storyPointsCompleted;
    }
}