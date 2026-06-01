package com.projectmanagement.dto.response.project;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStatsResponse {
    private Long totalTasks;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long todoTasks;
    private Integer progress;
    private Long totalMembers;
    private Long activeSprints;
}