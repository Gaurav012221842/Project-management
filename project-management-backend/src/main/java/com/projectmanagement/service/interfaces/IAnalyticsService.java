package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.response.analytics.*;
import java.util.UUID;

public interface IAnalyticsService {

    ProjectOverviewResponse getProjectOverview(
        UUID projectId
    );

    BurndownResponse getBurndownData(
        UUID projectId,
        UUID sprintId
    );

    VelocityResponse getVelocityData(
        UUID projectId
    );

    TeamPerformanceResponse getTeamPerformance(
        UUID projectId
    );

    WeeklyProgressResponse getWeeklyProgress(
        UUID projectId,
        Integer weeks
    );

    TaskDistributionResponse getTaskDistribution(
        UUID projectId
    );
}