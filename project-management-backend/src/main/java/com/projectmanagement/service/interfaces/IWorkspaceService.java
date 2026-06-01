package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.workspace.AddMemberRequest;
import com.projectmanagement.dto.request.workspace.CreateWorkspaceRequest;
import com.projectmanagement.dto.request.workspace.UpdateWorkspaceRequest;
import com.projectmanagement.dto.response.workspace.WorkspaceResponse;
import com.projectmanagement.entity.User;

import java.util.List;
import java.util.UUID;

public interface IWorkspaceService {
    WorkspaceResponse createWorkspace(CreateWorkspaceRequest request, User owner);
    List<WorkspaceResponse> getUserWorkspaces(User user);
    WorkspaceResponse getWorkspaceById(UUID id, User user);
    WorkspaceResponse updateWorkspace(UUID id, UpdateWorkspaceRequest request, User user);
    void deleteWorkspace(UUID id, User user);
    void addMember(UUID workspaceId, AddMemberRequest request, User requester);
    void removeMember(UUID workspaceId, UUID userId, User requester);
}
