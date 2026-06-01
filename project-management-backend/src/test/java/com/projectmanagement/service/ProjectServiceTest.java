package com.projectmanagement.service;

import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.entity.Workspace;
import com.projectmanagement.exception.custom.UnauthorizedException;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.WorkspaceMemberRepository;
import com.projectmanagement.repository.WorkspaceRepository;
import com.projectmanagement.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private WorkspaceRepository workspaceRepository;
    @Mock
    private WorkspaceMemberRepository workspaceMemberRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    @Test
    void createProject_ShouldThrow_WhenUserNotWorkspaceMember() {
        UUID workspaceId = UUID.randomUUID();
        User user = User.builder().id(UUID.randomUUID()).build();
        Workspace workspace = Workspace.builder().id(workspaceId).build();

        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("Test Project");

        when(workspaceRepository.findById(workspaceId)).thenReturn(Optional.of(workspace));
        when(workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, user.getId())).thenReturn(false);

        assertThatThrownBy(() -> projectService.createProject(workspaceId, request, user))
                .isInstanceOf(UnauthorizedException.class);
    }
}
