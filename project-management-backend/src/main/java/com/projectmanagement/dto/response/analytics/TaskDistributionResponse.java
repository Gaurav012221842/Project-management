package com.projectmanagement.dto.response.analytics;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDistributionResponse {

    private List<StatusData>   byStatus;
    private List<PriorityData> byPriority;
    private List<TypeData>     byType;

    @Data @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class StatusData {
        private String status;
        private Long   count;
        private Double percentage;
        private String color;
    }

    @Data @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class PriorityData {
        private String priority;
        private Long   count;
        private Double percentage;
        private String color;
    }

    @Data @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class TypeData {
        private String type;
        private Long   count;
        private Double percentage;
        private String color;
    }
}