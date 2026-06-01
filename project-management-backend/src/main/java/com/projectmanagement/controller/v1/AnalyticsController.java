package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.response.analytics.*;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.service.interfaces.IAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(
    name = "Analytics",
    description = "Analytics & Reports APIs"
)
public class AnalyticsController {

    private final IAnalyticsService analyticsService;

    @GetMapping("/projects/{projectId}/overview")
    @Operation(summary = "Get project overview stats")
    public ResponseEntity<ApiResponse<ProjectOverviewResponse>>
    getProjectOverview(
        @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                analyticsService
                    .getProjectOverview(projectId)
            )
        );
    }

    @GetMapping("/projects/{projectId}/burndown")
    @Operation(summary = "Get sprint burndown data")
    public ResponseEntity<ApiResponse<BurndownResponse>>
    getBurndown(
        @PathVariable UUID projectId,
        @RequestParam UUID sprintId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                analyticsService
                    .getBurndownData(projectId, sprintId)
            )
        );
    }

    @GetMapping("/projects/{projectId}/velocity")
    @Operation(summary = "Get team velocity data")
    public ResponseEntity<ApiResponse<VelocityResponse>>
    getVelocity(
        @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                analyticsService
                    .getVelocityData(projectId)
            )
        );
    }

    @GetMapping("/projects/{projectId}/team-performance")
    @Operation(summary = "Get team performance data")
    public ResponseEntity<ApiResponse<TeamPerformanceResponse>>
    getTeamPerformance(
        @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                analyticsService
                    .getTeamPerformance(projectId)
            )
        );
    }

    @GetMapping("/projects/{projectId}/weekly-progress")
    @Operation(summary = "Get weekly progress data")
    public ResponseEntity<ApiResponse<WeeklyProgressResponse>>
    getWeeklyProgress(
        @PathVariable UUID projectId,
        @RequestParam(defaultValue = "8")
        Integer weeks
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                analyticsService
                    .getWeeklyProgress(projectId, weeks)
            )
        );
    }

    @GetMapping("/projects/{projectId}/task-distribution")
    @Operation(summary = "Get task distribution data")
    public ResponseEntity<ApiResponse<TaskDistributionResponse>>
    getTaskDistribution(
        @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                analyticsService
                    .getTaskDistribution(projectId)
            )
        );
    }
}