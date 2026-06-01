package com.projectmanagement.dto.response.analytics;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamPerformanceResponse {

    private List<MemberPerformance> members;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberPerformance {
        private UUID userId;
        private String userName;
        private String userAvatar;
        private Long tasksAssigned;
        private Long tasksCompleted;
        private Long tasksInProgress;
        private Integer storyPointsCompleted;
        private Double completionRate;
        private Long commentsCount;
    }
}