package com.projectmanagement.dto.response.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStatsResponse {
    private Long totalProjects;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long totalStoryPoints;
    private Long totalComments;
    private Integer completionRate;
    private Long completedSprints;
}
