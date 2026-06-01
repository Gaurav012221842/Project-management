package com.projectmanagement.dto.response.analytics;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VelocityResponse {

    private Double averageVelocity;
    private List<SprintVelocity> sprints;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SprintVelocity {
        private String sprintName;
        private Integer plannedPoints;
        private Integer completedPoints;
        private Double velocityRate;
    }
}
