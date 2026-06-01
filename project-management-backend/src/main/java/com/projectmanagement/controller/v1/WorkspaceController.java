package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.workspace.AddMemberRequest;
import com.projectmanagement.dto.request.workspace.CreateWorkspaceRequest;
import com.projectmanagement.dto.request.workspace.UpdateWorkspaceRequest;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.workspace.WorkspaceResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.IWorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final IWorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceResponse>> create(@Valid @RequestBody CreateWorkspaceRequest request,
                                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(workspaceService.createWorkspace(request, user)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceResponse>>> getAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.getUserWorkspaces(user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> getById(@PathVariable UUID id,
                                                                   @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.getWorkspaceById(id, user)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> update(@PathVariable UUID id,
                                                                  @Valid @RequestBody UpdateWorkspaceRequest request,
                                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(workspaceService.updateWorkspace(id, request, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id, @AuthenticationPrincipal User user) {
        workspaceService.deleteWorkspace(id, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Workspace deleted"));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ApiResponse<Void>> addMember(@PathVariable UUID id,
                                                        @Valid @RequestBody AddMemberRequest request,
                                                        @AuthenticationPrincipal User user) {
        workspaceService.addMember(id, request, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Member added"));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable UUID id,
                                                           @PathVariable UUID userId,
                                                           @AuthenticationPrincipal User user) {
        workspaceService.removeMember(id, userId, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Member removed"));
    }
}
