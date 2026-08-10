package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.task.*;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.task.TaskResponse;
import com.projectmanagement.entity.*;
import com.projectmanagement.exception.custom.*;
import com.projectmanagement.mapper.TaskMapper;
import com.projectmanagement.repository.*;
import com.projectmanagement.service.interfaces.INotificationService;
import com.projectmanagement.service.interfaces.ITaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements ITaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final SprintRepository sprintRepository;
    private final UserRepository userRepository;
    private final LabelRepository labelRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final TaskMapper taskMapper;
    private final INotificationService notificationService;
    private final ActivityLogServiceImpl activityLogService;

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public TaskResponse createTask(UUID projectId, CreateTaskRequest request, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        verifyProjectAccess(project, user);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .reporter(user)
                .priority(request.getPriority())
                .type(request.getType())
                .storyPoints(request.getStoryPoints())
                .dueDate(request.getDueDate())
                .build();

        if (request.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(request.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", request.getSprintId()));
            task.setSprint(sprint);
        }

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssigneeId()));
            task.setAssignee(assignee);
            notificationService.sendTaskAssignedNotification(assignee, request.getTitle(), null);
        }

        if (request.getLabelIds() != null && !request.getLabelIds().isEmpty()) {
            List<Label> labels = labelRepository.findAllById(request.getLabelIds());
            task.setLabels(labels);
        }

        Task saved = taskRepository.save(task);
        activityLogService.log(project, user, "CREATED", "TASK", saved.getId(), null, saved.getTitle());
        return taskMapper.toResponse(saved);
    }

    // FIX: Use DB-level pagination instead of loading all tasks into memory
    @Override
    @Cacheable(value = "tasks", key = "'project:' + #projectId + ':page:' + #pageable.pageNumber + ':size:' + #pageable.pageSize + ':sort:' + #pageable.sort.toString() + ':user:' + #user.id")
    public PageResponse<TaskResponse> getTasks(UUID projectId, User user, Pageable pageable) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        verifyProjectAccess(project, user);

        Page<Task> taskPage = taskRepository.findByProjectIdOrderByPosition(projectId, pageable);

        return PageResponse.<TaskResponse>builder()
                .content(taskPage.getContent().stream().map(taskMapper::toResponse).toList())
                .page(taskPage.getNumber())
                .size(taskPage.getSize())
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .first(taskPage.isFirst())
                .last(taskPage.isLast())
                .build();
    }

    @Override
    @Cacheable(value = "tasks", key = "'task:' + #id + ':user:' + #user.id")
    public TaskResponse getTaskById(UUID id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        verifyProjectAccess(task.getProject(), user);
        return taskMapper.toResponse(task);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public TaskResponse updateTask(UUID id, UpdateTaskRequest request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        verifyProjectAccess(task.getProject(), user);

        String oldTitle = task.getTitle();
        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getType() != null) task.setType(request.getType());
        if (request.getStoryPoints() != null) task.setStoryPoints(request.getStoryPoints());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(request.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint", "id", request.getSprintId()));
            task.setSprint(sprint);
        }
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssigneeId()));
            task.setAssignee(assignee);
        }

        Task saved = taskRepository.save(task);
        // FIX: Log activity for task updates
        activityLogService.log(task.getProject(), user, "UPDATED", "TASK", saved.getId(), oldTitle, saved.getTitle());
        return taskMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public TaskResponse updateTaskStatus(UUID id, UpdateTaskStatusRequest request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        verifyProjectAccess(task.getProject(), user);

        String oldStatus = task.getStatus() != null ? task.getStatus().name() : null;
        task.setStatus(request.getStatus());
        if (request.getPosition() != null) task.setPosition(request.getPosition());

        Task saved = taskRepository.save(task);
        // FIX: Log activity for status changes
        activityLogService.log(task.getProject(), user, "STATUS_CHANGED", "TASK", saved.getId(), oldStatus,
                request.getStatus() != null ? request.getStatus().name() : null);
        return taskMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public TaskResponse assignTask(UUID id, AssignTaskRequest request, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        verifyProjectAccess(task.getProject(), user);

        String oldAssignee = task.getAssignee() != null ? task.getAssignee().getName() : "Unassigned";
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssigneeId()));
            task.setAssignee(assignee);
            notificationService.sendTaskAssignedNotification(assignee, task.getTitle(), task.getId());
            // FIX: Log activity for task assignment
            activityLogService.log(task.getProject(), user, "ASSIGNED", "TASK", task.getId(), oldAssignee, assignee.getName());
        } else {
            task.setAssignee(null);
            activityLogService.log(task.getProject(), user, "UNASSIGNED", "TASK", task.getId(), oldAssignee, "Unassigned");
        }
        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public void deleteTask(UUID id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        verifyProjectAccess(task.getProject(), user);
        // FIX: Log activity before deletion (capture values while entity is still available)
        activityLogService.log(task.getProject(), user, "DELETED", "TASK", task.getId(), task.getTitle(), null);
        taskRepository.delete(task);
    }

    private void verifyProjectAccess(Project project, User user) {
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(project.getWorkspace().getId(), user.getId())) {
            throw new UnauthorizedException("Access denied to this project");
        }
    }
}
