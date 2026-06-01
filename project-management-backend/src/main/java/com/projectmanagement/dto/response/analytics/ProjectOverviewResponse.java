package com.projectmanagement.dto.response.analytics;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectOverviewResponse {

    // Task Stats
    private Long totalTasks;
    private Long completedTasks;
    private Long inProgressTasks;
    private Long todoTasks;
    private Long inReviewTasks;
    private Integer completionPercentage;

    // Sprint Stats
    private Long totalSprints;
    private Long activeSprints;
    private Long completedSprints;

    // Team Stats
    private Long totalMembers;
    private Long activeMembers;

    // Story Points
    private Integer totalStoryPoints;
    private Integer completedStoryPoints;

    // Priority Distribution
    private Map<String, Long> tasksByPriority;

    // Type Distribution
    private Map<String, Long> tasksByType;

    // Recent Activity Count
    private Long activityLast7Days;

    // Overdue Tasks
    private Long overdueTasks;
}

// ================================
