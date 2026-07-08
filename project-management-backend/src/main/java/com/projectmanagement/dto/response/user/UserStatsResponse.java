package com.projectmanagement.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private Long totalProjects;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long totalStoryPoints;
    private Long totalComments;
    private Integer completionRate;
    private Long completedSprints;
}
