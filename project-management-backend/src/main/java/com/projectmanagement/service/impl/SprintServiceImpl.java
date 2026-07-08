package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.sprint
    .CreateSprintRequest;
import com.projectmanagement.dto.request.sprint
    .UpdateSprintRequest;
import com.projectmanagement.dto.response.sprint
    .SprintResponse;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.Sprint;
import com.projectmanagement.entity.Task;
import com.projectmanagement.enums.SprintStatus;
import com.projectmanagement.enums.TaskStatus;
import com.projectmanagement.exception.custom
    .BadRequestException;
import com.projectmanagement.exception.custom
    .ResourceNotFoundException;
import com.projectmanagement.repository
    .ProjectRepository;
import com.projectmanagement.repository
    .SprintRepository;
import com.projectmanagement.repository
    .TaskRepository;
import com.projectmanagement.service.interfaces
    .ISprintService;
import com.projectmanagement.service.interfaces
    .INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
    .Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SprintServiceImpl
    implements ISprintService {

    private final SprintRepository      sprintRepository;
    private final ProjectRepository     projectRepository;
    private final TaskRepository        taskRepository;
    private final INotificationService  notificationService;

    // ============================
    // Create Sprint
    // ============================
    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "sprints", allEntries = true),
        @CacheEvict(value = "projectStats", allEntries = true),
        @CacheEvict(value = "analytics", allEntries = true),
        @CacheEvict(value = "users", allEntries = true)
    })
    public SprintResponse createSprint(
        UUID                projectId,
        CreateSprintRequest request
    ) {
        Project project = findProject(projectId);

        // Validate dates
        if (request.getEndDate()
                .isBefore(request.getStartDate())) {
            throw new BadRequestException(
                "End date must be after start date"
            );
        }

        // Check name uniqueness
        if (sprintRepository.existsByNameAndProjectId(
                request.getName(), projectId)) {
            throw new BadRequestException(
                "Sprint name already exists"
            );
        }

        Sprint sprint = Sprint.builder()
            .name(request.getName())
            .goal(request.getGoal())
            .project(project)
            .status(SprintStatus.PLANNED)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .build();

        Sprint saved = sprintRepository.save(sprint);

        log.info(
            "Sprint created: {} in project: {}",
            saved.getId(), projectId
        );

        return toResponse(saved);
    }

    // ============================
    // Get All Sprints
    // ============================
    @Override
    @Cacheable(value = "sprints", key = "'project:' + #projectId")
    public List<SprintResponse> getSprints(
        UUID projectId
    ) {
        findProject(projectId);

        return sprintRepository
            .findByProjectIdOrderByStartDate(projectId)
            .stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    // ============================
    // Get Sprint By ID
    // ============================
    @Override
    @Cacheable(value = "sprints", key = "'project:' + #projectId + ':sprint:' + #sprintId")
    public SprintResponse getSprintById(
        UUID projectId,
        UUID sprintId
    ) {
        Sprint sprint = findSprint(
            projectId, sprintId
        );
        return toResponse(sprint);
    }

    // ============================
    // Update Sprint
    // ============================
    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "sprints", allEntries = true),
        @CacheEvict(value = "projectStats", allEntries = true),
        @CacheEvict(value = "analytics", allEntries = true),
        @CacheEvict(value = "users", allEntries = true)
    })
    public SprintResponse updateSprint(
        UUID                projectId,
        UUID                sprintId,
        UpdateSprintRequest request
    ) {
        Sprint sprint = findSprint(
            projectId, sprintId
        );

        if (sprint.getStatus() == SprintStatus.COMPLETED
            && request.getStartDate() != null) {
            throw new BadRequestException(
                "Cannot update dates of completed sprint"
            );
        }

        if (request.getName() != null &&
            !request.getName().isEmpty()) {
            sprint.setName(request.getName());
        }
        if (request.getGoal() != null) {
            sprint.setGoal(request.getGoal());
        }
        if (request.getStartDate() != null) {
            sprint.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            if (request.getEndDate()
                    .isBefore(sprint.getStartDate())) {
                throw new BadRequestException(
                    "End date must be after start date"
                );
            }
            sprint.setEndDate(request.getEndDate());
        }

        return toResponse(sprintRepository.save(sprint));
    }

    // ============================
    // Delete Sprint
    // ============================
    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "sprints", allEntries = true),
        @CacheEvict(value = "tasks", allEntries = true),
        @CacheEvict(value = "projectStats", allEntries = true),
        @CacheEvict(value = "analytics", allEntries = true),
        @CacheEvict(value = "users", allEntries = true)
    })
    public void deleteSprint(
        UUID projectId,
        UUID sprintId
    ) {
        Sprint sprint = findSprint(
            projectId, sprintId
        );

        if (sprint.getStatus() == SprintStatus.ACTIVE) {
            throw new BadRequestException(
                "Cannot delete an active sprint. " +
                "Complete it first."
            );
        }

        // Move tasks to backlog
        List<Task> tasks =
            taskRepository.findBySprintId(sprint.getId());
        tasks.forEach(t -> t.setSprint(null));
        taskRepository.saveAll(tasks);

        sprintRepository.delete(sprint);

        log.info(
            "Sprint deleted: {} in project: {}",
            sprintId, projectId
        );
    }

    // ============================
    // Start Sprint
    // ============================
    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "sprints", allEntries = true),
        @CacheEvict(value = "projectStats", allEntries = true),
        @CacheEvict(value = "analytics", allEntries = true),
        @CacheEvict(value = "users", allEntries = true)
    })
    public SprintResponse startSprint(
        UUID projectId,
        UUID sprintId
    ) {
        Sprint sprint = findSprint(
            projectId, sprintId
        );

        if (sprint.getStatus() != SprintStatus.PLANNED) {
            throw new BadRequestException(
                "Only planned sprints can be started"
            );
        }

        // Check no active sprint
        Optional<Sprint> activeSprint =
            sprintRepository.findByProjectIdAndStatus(
                projectId, SprintStatus.ACTIVE
            );

        if (activeSprint.isPresent()) {
            throw new BadRequestException(
                "A sprint is already active. " +
                "Complete it before starting another."
            );
        }

        sprint.setStatus(SprintStatus.ACTIVE);
        Sprint saved = sprintRepository.save(sprint);

        // Notify project members
        Project project = sprint.getProject();
        List<com.projectmanagement.entity.User>
            members = project.getMembers()
                .stream()
                .map(pm -> pm.getUser())
                .collect(Collectors.toList());

        notificationService
            .sendSprintStartedNotification(
                members,
                sprint.getName(),
                sprint.getProject().getId()
            );

        log.info(
            "Sprint started: {} in project: {}",
            sprintId, projectId
        );

        return toResponse(saved);
    }

    // ============================
    // Complete Sprint
    // ============================
    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "sprints", allEntries = true),
        @CacheEvict(value = "tasks", allEntries = true),
        @CacheEvict(value = "projectStats", allEntries = true),
        @CacheEvict(value = "analytics", allEntries = true),
        @CacheEvict(value = "users", allEntries = true)
    })
    public SprintResponse completeSprint(
        UUID projectId,
        UUID sprintId
    ) {
        Sprint sprint = findSprint(
            projectId, sprintId
        );

        if (sprint.getStatus() != SprintStatus.ACTIVE) {
            throw new BadRequestException(
                "Only active sprints can be completed"
            );
        }

        // Move incomplete tasks to backlog
        List<Task> incompleteTasks =
            taskRepository.findBySprintId(sprint.getId())
                .stream()
                .filter(t ->
                    t.getStatus() != TaskStatus.DONE
                )
                .collect(Collectors.toList());

        incompleteTasks.forEach(t -> t.setSprint(null));
        taskRepository.saveAll(incompleteTasks);

        sprint.setStatus(SprintStatus.COMPLETED);
        Sprint saved = sprintRepository.save(sprint);

        log.info(
            "Sprint completed: {} | {} tasks moved " +
            "to backlog",
            sprintId,
            incompleteTasks.size()
        );

        return toResponse(saved);
    }

    // ============================
    // Helpers
    // ============================
    private Project findProject(UUID projectId) {
        return projectRepository
            .findById(projectId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Project not found"
                )
            );
    }

    private Sprint findSprint(
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

        if (!sprint.getProject()
                .getId().equals(projectId)) {
            throw new ResourceNotFoundException(
                "Sprint not found in this project"
            );
        }

        return sprint;
    }

    private SprintResponse toResponse(Sprint sprint) {
        List<Task> tasks =
            taskRepository.findBySprintId(sprint.getId());

        int totalTasks     = tasks.size();
        int completedTasks = (int) tasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.DONE)
            .count();

        int totalPoints = tasks.stream()
            .mapToInt(t ->
                t.getStoryPoints() != null
                    ? t.getStoryPoints() : 0
            ).sum();

        int completedPoints = tasks.stream()
            .filter(t -> t.getStatus() == TaskStatus.DONE)
            .mapToInt(t ->
                t.getStoryPoints() != null
                    ? t.getStoryPoints() : 0
            ).sum();

        int progress = totalTasks == 0
            ? 0
            : Math.round(
                (float) completedTasks /
                totalTasks * 100
              );

        return SprintResponse.builder()
            .id(sprint.getId())
            .name(sprint.getName())
            .goal(sprint.getGoal())
            .status(sprint.getStatus())
            .startDate(sprint.getStartDate())
            .endDate(sprint.getEndDate())
            .projectId(sprint.getProject().getId())
            .totalTasks(totalTasks)
            .completedTasks(completedTasks)
            .totalStoryPoints(totalPoints)
            .completedStoryPoints(completedPoints)
            .progress(progress)
            .createdAt(sprint.getCreatedAt())
            .updatedAt(sprint.getUpdatedAt())
            .build();
    }
}
