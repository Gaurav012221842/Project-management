package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.request.project.UpdateProjectRequest;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.dto.response.project.ProjectStatsResponse;
import com.projectmanagement.dto.response.user.ActivityLogResponse;
import com.projectmanagement.entity.User;

import java.util.UUID;

public interface IProjectService {
    ProjectResponse createProject(UUID workspaceId, CreateProjectRequest request, User user);
    PageResponse<ProjectResponse> getWorkspaceProjects(UUID workspaceId, int page, int size, User user);
    ProjectResponse getProjectById(UUID workspaceId, UUID projectId, User user);
    ProjectResponse updateProject(UUID workspaceId, UUID projectId, UpdateProjectRequest request, User user);
    void deleteProject(UUID workspaceId, UUID projectId, User user);
    ProjectStatsResponse getProjectStats(UUID id, User user);
    PageResponse<ActivityLogResponse> getProjectActivity(UUID projectId, int page, int size, User user);
}
