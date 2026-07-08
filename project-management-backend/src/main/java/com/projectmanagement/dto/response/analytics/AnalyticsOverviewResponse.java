package com.projectmanagement.dto.response.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsOverviewResponse {
    private long totalProjects;
    private long activeProjects;
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;
    private long totalMembers;
    private double taskCompletionRate;
    private double averageTasksPerSprint;
}
