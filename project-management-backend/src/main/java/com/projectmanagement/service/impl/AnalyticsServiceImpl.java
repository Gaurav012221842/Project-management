package com.projectmanagement.service.impl;

import com.projectmanagement.dto.response.analytics.*;
import com.projectmanagement.entity.*;
import com.projectmanagement.enums.*;
import com.projectmanagement.exception.custom
    .ResourceNotFoundException;
import com.projectmanagement.repository.*;
import com.projectmanagement.service.interfaces
    .IAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsServiceImpl
    implements IAnalyticsService {

    private final ProjectRepository    projectRepository;
    private final TaskRepository       taskRepository;
    private final SprintRepository     sprintRepository;
    private final CommentRepository    commentRepository;
    private final ProjectMemberRepository memberRepository;
    private final ActivityLogRepository activityLogRepository;

    // ============================
    // Project Overview
    // ============================
    @Override
    @Cacheable(
        value = "analytics",
        key = "'overview:' + #projectId"
    )
    public ProjectOverviewResponse getProjectOverview(
        UUID projectId
    ) {
        validateProject(projectId);

        List<Task> tasks =
            taskRepository
                .findByProjectIdOrderByPosition(
                    projectId
                );

        // Task Counts by Status
        Map<TaskStatus, Long> statusCounts =
            tasks.stream().collect(
                Collectors.groupingBy(
                    Task::getStatus,
                    Collectors.counting()
                )
            );

        // Story Points
        int totalPoints = tasks.stream()
            .mapToInt(t ->
                t.getStoryPoints() != null
                    ? t.getStoryPoints() : 0
            ).sum();

        int completedPoints = tasks.stream()
            .filter(t ->
                t.getStatus() == TaskStatus.DONE
            )
            .mapToInt(t ->
                t.getStoryPoints() != null
                    ? t.getStoryPoints() : 0
            ).sum();

        // Priority Distribution
        Map<String, Long> priorityDist =
            tasks.stream().collect(
                Collectors.groupingBy(
                    t -> t.getPriority().name(),
                    Collectors.counting()
                )
            );

        // Type Distribution
        Map<String, Long> typeDist =
            tasks.stream().collect(
                Collectors.groupingBy(
                    t -> t.getType().name(),
                    Collectors.counting()
                )
            );

        // Overdue Tasks
        long overdue = tasks.stream()
            .filter(t ->
                t.getDueDate() != null &&
                t.getDueDate().isBefore(
                    LocalDate.now()
                ) &&
                t.getStatus() != TaskStatus.DONE
            ).count();

        // Completion %
        int completionPct = tasks.isEmpty() ? 0 :
            (int) Math.round(
                (double) statusCounts.getOrDefault(
                    TaskStatus.DONE, 0L
                ) / tasks.size() * 100
            );

        // Sprint Stats
        List<Sprint> sprints =
            sprintRepository
                .findByProjectIdOrderByStartDate(
                    projectId
                );

        return ProjectOverviewResponse.builder()
            .totalTasks((long) tasks.size())
            .completedTasks(
                statusCounts.getOrDefault(
                    TaskStatus.DONE, 0L
                )
            )
            .inProgressTasks(
                statusCounts.getOrDefault(
                    TaskStatus.IN_PROGRESS, 0L
                )
            )
            .todoTasks(
                statusCounts.getOrDefault(
                    TaskStatus.TODO, 0L
                )
            )
            .inReviewTasks(
                statusCounts.getOrDefault(
                    TaskStatus.IN_REVIEW, 0L
                )
            )
            .completionPercentage(completionPct)
            .totalSprints((long) sprints.size())
            .activeSprints(
                sprints.stream()
                    .filter(s ->
                        s.getStatus() ==
                        SprintStatus.ACTIVE
                    ).count()
            )
            .completedSprints(
                sprints.stream()
                    .filter(s ->
                        s.getStatus() ==
                        SprintStatus.COMPLETED
                    ).count()
            )
            .totalStoryPoints(totalPoints)
            .completedStoryPoints(completedPoints)
            .tasksByPriority(priorityDist)
            .tasksByType(typeDist)
            .overdueTasks(overdue)
            .build();
    }

    // ============================
    // Burndown Chart
    // ============================
    @Override
    @Cacheable(
        value = "analytics",
        key = "'burndown:project:' + #projectId + ':sprint:' + #sprintId"
    )
    public BurndownResponse getBurndownData(
        UUID projectId,
        UUID sprintId
    ) {
        Sprint sprint = sprintRepository
            .findById(sprintId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Sprint not found"
                )
            );

        List<Task> sprintTasks =
            taskRepository.findBySprintId(sprint.getId());

        int totalPoints = sprintTasks.stream()
            .mapToInt(t ->
                t.getStoryPoints() != null
                    ? t.getStoryPoints() : 0
            ).sum();

        LocalDate start = sprint.getStartDate();
        LocalDate end   = sprint.getEndDate();
        long totalDays  = ChronoUnit.DAYS
            .between(start, end) + 1;

        // Ideal Burndown Line
        List<BurndownResponse.BurndownDataPoint>
            idealLine = new ArrayList<>();

        for (long i = 0; i < totalDays; i++) {
            LocalDate date = start.plusDays(i);
            int idealRemaining = (int) Math.round(
                totalPoints -
                (totalPoints * i / (totalDays - 1))
            );
            idealLine.add(
                BurndownResponse.BurndownDataPoint
                    .builder()
                    .date(date.format(
                        DateTimeFormatter
                            .ofPattern("MMM dd")
                    ))
                    .remaining(idealRemaining)
                    .build()
            );
        }

        // Actual Burndown Line
        List<BurndownResponse.BurndownDataPoint>
            actualLine = new ArrayList<>();

        int remaining = totalPoints;
        LocalDate today = LocalDate.now();

        for (long i = 0; i < totalDays; i++) {
            LocalDate date = start.plusDays(i);
            if (date.isAfter(today)) break;

            // Count tasks completed on this date
            final LocalDate currentDate = date;
            int completedOnDate = sprintTasks.stream()
                .filter(t ->
                    t.getStatus() == TaskStatus.DONE &&
                    t.getUpdatedAt() != null &&
                    t.getUpdatedAt().toLocalDate()
                        .equals(currentDate)
                )
                .mapToInt(t ->
                    t.getStoryPoints() != null
                        ? t.getStoryPoints() : 0
                )
                .sum();

            remaining -= completedOnDate;
            actualLine.add(
                BurndownResponse.BurndownDataPoint
                    .builder()
                    .date(date.format(
                        DateTimeFormatter
                            .ofPattern("MMM dd")
                    ))
                    .remaining(
                        Math.max(0, remaining)
                    )
                    .completed(completedOnDate)
                    .build()
            );
        }

        return BurndownResponse.builder()
            .sprintName(sprint.getName())
            .totalStoryPoints(totalPoints)
            .idealLine(idealLine)
            .actualLine(actualLine)
            .build();
    }

    // ============================
    // Velocity Chart
    // ============================
    @Override
    @Cacheable(
        value = "analytics",
        key = "'velocity:' + #projectId"
    )
    public VelocityResponse getVelocityData(
        UUID projectId
    ) {
        List<Sprint> sprints =
            sprintRepository
                .findByProjectIdOrderByStartDate(
                    projectId
                );

        List<VelocityResponse.SprintVelocity>
            velocities = sprints.stream()
            .filter(s ->
                s.getStatus() !=
                SprintStatus.PLANNED
            )
            .map(sprint -> {
                List<Task> tasks =
                    taskRepository
                        .findBySprintId(sprint.getId());

                int planned = tasks.stream()
                    .mapToInt(t ->
                        t.getStoryPoints() != null
                            ? t.getStoryPoints() : 0
                    ).sum();

                int completed = tasks.stream()
                    .filter(t ->
                        t.getStatus() == TaskStatus.DONE
                    )
                    .mapToInt(t ->
                        t.getStoryPoints() != null
                            ? t.getStoryPoints() : 0
                    ).sum();

                double rate = planned == 0 ? 0 :
                    Math.round(
                        (double) completed /
                        planned * 100.0
                    ) / 100.0;

                return VelocityResponse.SprintVelocity
                    .builder()
                    .sprintName(sprint.getName())
                    .plannedPoints(planned)
                    .completedPoints(completed)
                    .velocityRate(rate)
                    .build();
            })
            .collect(Collectors.toList());

        double avgVelocity = velocities.isEmpty() ? 0 :
            velocities.stream()
                .mapToInt(
                    VelocityResponse
                        .SprintVelocity
                        ::getCompletedPoints
                )
                .average()
                .orElse(0);

        return VelocityResponse.builder()
            .averageVelocity(
                Math.round(avgVelocity * 10.0) / 10.0
            )
            .sprints(velocities)
            .build();
    }

    // ============================
    // Team Performance
    // ============================
    @Override
    @Cacheable(
        value = "analytics",
        key = "'team:' + #projectId"
    )
    public TeamPerformanceResponse getTeamPerformance(
        UUID projectId
    ) {
        List<Task> allTasks =
            taskRepository
                .findByProjectIdOrderByPosition(
                    projectId
                );

        Map<UUID, List<Task>> tasksByUser =
            allTasks.stream()
                .filter(t -> t.getAssignee() != null)
                .collect(
                    Collectors.groupingBy(
                        t -> t.getAssignee().getId()
                    )
                );

        List<TeamPerformanceResponse.MemberPerformance>
            performances = tasksByUser.entrySet()
            .stream()
            .map(entry -> {
                User user = entry.getValue()
                    .get(0).getAssignee();
                List<Task> userTasks = entry.getValue();

                long completed = userTasks.stream()
                    .filter(t ->
                        t.getStatus() == TaskStatus.DONE
                    ).count();

                long inProgress = userTasks.stream()
                    .filter(t ->
                        t.getStatus() ==
                        TaskStatus.IN_PROGRESS
                    ).count();

                int storyPts = userTasks.stream()
                    .filter(t ->
                        t.getStatus() == TaskStatus.DONE
                    )
                    .mapToInt(t ->
                        t.getStoryPoints() != null
                            ? t.getStoryPoints() : 0
                    ).sum();

                double rate = userTasks.isEmpty() ? 0 :
                    Math.round(
                        (double) completed /
                        userTasks.size() * 100.0
                    ) / 100.0;

                long commentsCount =
                    commentRepository
                        .countByAuthorId(user.getId());

                return TeamPerformanceResponse
                    .MemberPerformance.builder()
                    .userId(user.getId())
                    .userName(user.getName())
                    .userAvatar(user.getProfilePic())
                    .tasksAssigned(
                        (long) userTasks.size()
                    )
                    .tasksCompleted(completed)
                    .tasksInProgress(inProgress)
                    .storyPointsCompleted(storyPts)
                    .completionRate(rate)
                    .commentsCount(commentsCount)
                    .build();
            })
            .sorted(
                Comparator.comparingLong(
                    TeamPerformanceResponse
                        .MemberPerformance
                        ::getTasksCompleted
                ).reversed()
            )
            .collect(Collectors.toList());

        return TeamPerformanceResponse.builder()
            .members(performances)
            .build();
    }

    // ============================
    // Weekly Progress
    // ============================
    @Override
    @Cacheable(
        value = "analytics",
        key = "'weekly:' + #projectId + ':weeks:' + #weeks"
    )
    public WeeklyProgressResponse getWeeklyProgress(
        UUID projectId,
        Integer weeks
    ) {
        List<Task> allTasks =
            taskRepository
                .findByProjectIdOrderByPosition(
                    projectId
                );

        List<WeeklyProgressResponse.WeekData>
            weekData = new ArrayList<>();

        DateTimeFormatter fmt =
            DateTimeFormatter.ofPattern("MMM dd");

        for (int i = weeks - 1; i >= 0; i--) {
            LocalDate weekEnd =
                LocalDate.now().minusWeeks(i);
            LocalDate weekStart =
                weekEnd.minusDays(6);

            final LocalDate ws = weekStart;
            final LocalDate we = weekEnd;

            int created = (int) allTasks.stream()
                .filter(t -> {
                    LocalDate created2 =
                        t.getCreatedAt() != null
                            ? t.getCreatedAt()
                               .toLocalDate()
                            : null;
                    return created2 != null &&
                        !created2.isBefore(ws) &&
                        !created2.isAfter(we);
                }).count();

            int completed = (int) allTasks.stream()
                .filter(t -> {
                    LocalDate updated =
                        t.getUpdatedAt() != null
                            ? t.getUpdatedAt()
                               .toLocalDate()
                            : null;
                    return updated != null &&
                        !updated.isBefore(ws) &&
                        !updated.isAfter(we) &&
                        t.getStatus() == TaskStatus.DONE;
                }).count();

            int points = allTasks.stream()
                .filter(t -> {
                    LocalDate updated =
                        t.getUpdatedAt() != null
                            ? t.getUpdatedAt()
                               .toLocalDate()
                            : null;
                    return updated != null &&
                        !updated.isBefore(ws) &&
                        !updated.isAfter(we) &&
                        t.getStatus() == TaskStatus.DONE;
                })
                .mapToInt(t ->
                    t.getStoryPoints() != null
                        ? t.getStoryPoints() : 0
                ).sum();

            weekData.add(
                WeeklyProgressResponse.WeekData
                    .builder()
                    .week("Week " + (weeks - i))
                    .dateRange(
                        weekStart.format(fmt) +
                        " - " +
                        weekEnd.format(fmt)
                    )
                    .tasksCreated(created)
                    .tasksCompleted(completed)
                    .storyPointsCompleted(points)
                    .build()
            );
        }

        return WeeklyProgressResponse.builder()
            .weeks(weekData)
            .build();
    }

    // ============================
    // Task Distribution
    // ============================
    @Override
    @Cacheable(
        value = "analytics",
        key = "'distribution:' + #projectId"
    )
    public TaskDistributionResponse getTaskDistribution(
        UUID projectId
    ) {
        List<Task> tasks =
            taskRepository
                .findByProjectIdOrderByPosition(
                    projectId
                );

        int total = tasks.size();

        // Status Colors
        Map<String, String> statusColors = Map.of(
            "TODO",        "#94a3b8",
            "IN_PROGRESS", "#6366f1",
            "IN_REVIEW",   "#f59e0b",
            "DONE",        "#22c55e"
        );

        // Priority Colors
        Map<String, String> priorityColors = Map.of(
            "LOW",      "#94a3b8",
            "MEDIUM",   "#6366f1",
            "HIGH",     "#f97316",
            "CRITICAL", "#ef4444"
        );

        // Type Colors
        Map<String, String> typeColors = Map.of(
            "FEATURE",     "#6366f1",
            "BUG",         "#ef4444",
            "IMPROVEMENT", "#f59e0b",
            "TASK",        "#22c55e"
        );

        // By Status
        List<TaskDistributionResponse.StatusData>
            byStatus = Arrays
            .stream(TaskStatus.values())
            .map(status -> {
                long count = tasks.stream()
                    .filter(t ->
                        t.getStatus() == status
                    ).count();
                return TaskDistributionResponse
                    .StatusData.builder()
                    .status(status.name())
                    .count(count)
                    .percentage(
                        total == 0 ? 0 :
                        Math.round(
                            (double) count /
                            total * 100 * 10
                        ) / 10.0
                    )
                    .color(
                        statusColors.getOrDefault(
                            status.name(), "#94a3b8"
                        )
                    )
                    .build();
            })
            .collect(Collectors.toList());

        // By Priority
        List<TaskDistributionResponse.PriorityData>
            byPriority = Arrays
            .stream(TaskPriority.values())
            .map(priority -> {
                long count = tasks.stream()
                    .filter(t ->
                        t.getPriority() == priority
                    ).count();
                return TaskDistributionResponse
                    .PriorityData.builder()
                    .priority(priority.name())
                    .count(count)
                    .percentage(
                        total == 0 ? 0 :
                        Math.round(
                            (double) count /
                            total * 100 * 10
                        ) / 10.0
                    )
                    .color(
                        priorityColors.getOrDefault(
                            priority.name(), "#94a3b8"
                        )
                    )
                    .build();
            })
            .collect(Collectors.toList());

        // By Type
        List<TaskDistributionResponse.TypeData>
            byType = Arrays
            .stream(TaskType.values())
            .map(type -> {
                long count = tasks.stream()
                    .filter(t ->
                        t.getType() == type
                    ).count();
                return TaskDistributionResponse
                    .TypeData.builder()
                    .type(type.name())
                    .count(count)
                    .percentage(
                        total == 0 ? 0 :
                        Math.round(
                            (double) count /
                            total * 100 * 10
                        ) / 10.0
                    )
                    .color(
                        typeColors.getOrDefault(
                            type.name(), "#94a3b8"
                        )
                    )
                    .build();
            })
            .collect(Collectors.toList());

        return TaskDistributionResponse.builder()
            .byStatus(byStatus)
            .byPriority(byPriority)
            .byType(byType)
            .build();
    }

    // ============================
    // Helper
    // ============================
    private void validateProject(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException(
                "Project not found"
            );
        }
    }
}
