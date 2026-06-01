package com.projectmanagement.dto.response.analytics;


import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BurndownResponse {

    private String sprintName;
    private Integer totalStoryPoints;
    private List<BurndownDataPoint> idealLine;
    private List<BurndownDataPoint> actualLine;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BurndownDataPoint {
        private String date;
        private Integer remaining;
        private Integer completed;
    }
}