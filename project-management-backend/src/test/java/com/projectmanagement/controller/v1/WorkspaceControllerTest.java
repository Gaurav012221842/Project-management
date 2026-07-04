package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.workspace.InviteMemberRequest;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.IWorkspaceService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class WorkspaceControllerTest {

    @Mock
    private IWorkspaceService workspaceService;

    @InjectMocks
    private WorkspaceController controller;

    @Test
    void inviteMemberShouldDelegateToService() {
        UUID workspaceId = UUID.randomUUID();
        InviteMemberRequest request = new InviteMemberRequest();
        request.setEmail("colleague@example.com");
        User requester = new User();

        ResponseEntity<ApiResponse<Void>> response = controller.inviteMember(workspaceId, request, requester);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(workspaceService).inviteMember(workspaceId, "colleague@example.com", requester);
    }
}
