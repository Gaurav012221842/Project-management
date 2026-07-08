package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.request.project.UpdateProjectRequest;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.dto.response.project.ProjectStatsResponse;
import com.projectmanagement.dto.response.user.ActivityLogResponse;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.User;
import com.projectmanagement.entity.Workspace;
import com.projectmanagement.enums.TaskStatus;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.exception.custom.UnauthorizedException;
import com.projectmanagement.mapper.ProjectMapper;
import com.projectmanagement.repository.ActivityLogRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.TaskRepository;
import com.projectmanagement.repository.WorkspaceMemberRepository;
import com.projectmanagement.repository.WorkspaceRepository;
import com.projectmanagement.service.interfaces.IProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements IProjectService {

    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;
    private final ProjectMapper projectMapper;

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "workspaces", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public ProjectResponse createProject(UUID workspaceId, CreateProjectRequest request, User user) {
        verifyWorkspaceAccess(workspaceId, user);
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();

        Project project = Project.builder()
                .workspace(workspace)
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .owner(user)
                .build();

        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    @Cacheable(value = "projects", key = "'workspace:' + #workspaceId + ':page:' + #page + ':size:' + #size + ':user:' + #user.id")
    public PageResponse<ProjectResponse> getWorkspaceProjects(UUID workspaceId, int page, int size, User user) {
        verifyWorkspaceAccess(workspaceId, user);
        Page<Project> pageResult = projectRepository.findByWorkspaceId(workspaceId, PageRequest.of(page, size));
        return PageResponse.<ProjectResponse>builder()
                .content(pageResult.getContent().stream().map(projectMapper::toResponse).toList())
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();
    }

    @Override
    @Cacheable(value = "projects", key = "'project:' + #projectId + ':workspace:' + #workspaceId + ':user:' + #user.id")
    public ProjectResponse getProjectById(UUID workspaceId, UUID projectId, User user) {
        verifyWorkspaceAccess(workspaceId, user);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        return projectMapper.toResponse(project);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public ProjectResponse updateProject(UUID workspaceId, UUID projectId, UpdateProjectRequest request, User user) {
        verifyWorkspaceAccess(workspaceId, user);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        if (request.getStartDate() != null) project.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) project.setEndDate(request.getEndDate());
        return projectMapper.toResponse(projectRepository.save(project));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "projects", allEntries = true),
            @CacheEvict(value = "projectStats", allEntries = true),
            @CacheEvict(value = "tasks", allEntries = true),
            @CacheEvict(value = "sprints", allEntries = true),
            @CacheEvict(value = "analytics", allEntries = true),
            @CacheEvict(value = "users", allEntries = true)
    })
    public void deleteProject(UUID workspaceId, UUID projectId, User user) {
        verifyWorkspaceAccess(workspaceId, user);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        projectRepository.delete(project);
    }

    @Override
    @Cacheable(value = "projectStats", key = "'project:' + #id + ':user:' + #user.id")
    public ProjectStatsResponse getProjectStats(UUID id, User user) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        verifyWorkspaceAccess(project.getWorkspace().getId(), user);
        long done = taskRepository.countByProjectIdAndStatus(id, TaskStatus.DONE);
        long inProgress = taskRepository.countByProjectIdAndStatus(id, TaskStatus.IN_PROGRESS);
        long todo = taskRepository.countByProjectIdAndStatus(id, TaskStatus.TODO);

        return ProjectStatsResponse.builder()
                .totalTasks((long) project.getTasks().size())
                .completedTasks(done)
                .inProgressTasks(inProgress)
                .todoTasks(todo)
                .totalMembers((long) project.getMembers().size())
                .build();
    }

    @Override
    @Cacheable(value = "projects", key = "'activity:' + #projectId + ':page:' + #page + ':size:' + #size + ':user:' + #user.id")
    public PageResponse<ActivityLogResponse> getProjectActivity(UUID projectId, int page, int size, User user) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        verifyWorkspaceAccess(project.getWorkspace().getId(), user);
        Page<com.projectmanagement.entity.ActivityLog> activityPage =
                activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId,
                        PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        Page<ActivityLogResponse> responsePage = activityPage.map(activity -> ActivityLogResponse.builder()
                .id(activity.getId())
                .action(activity.getAction())
                .entityType(activity.getEntityType())
                .entityId(activity.getEntityId())
                .oldValue(activity.getOldValue())
                .newValue(activity.getNewValue())
                .createdAt(activity.getCreatedAt())
                .build());

        return PageResponse.<ActivityLogResponse>builder()
                .content(responsePage.getContent())
                .page(responsePage.getNumber())
                .size(responsePage.getSize())
                .totalElements(responsePage.getTotalElements())
                .totalPages(responsePage.getTotalPages())
                .first(responsePage.isFirst())
                .last(responsePage.isLast())
                .build();
    }

    private void verifyWorkspaceAccess(UUID workspaceId, User user) {
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, user.getId())) {
            throw new UnauthorizedException("Access denied to this workspace");
        }
    }
}
