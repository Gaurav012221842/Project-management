package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.request.project.UpdateProjectRequest;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.IProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final IProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> create(@PathVariable UUID workspaceId,
                                                                @Valid @RequestBody CreateProjectRequest request,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(projectService.createProject(workspaceId, request, user)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProjectResponse>>> getAll(@PathVariable UUID workspaceId,
                                                                              @RequestParam(defaultValue = "0") int page,
                                                                              @RequestParam(defaultValue = "10") int size,
                                                                              @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getWorkspaceProjects(workspaceId, page, size, user)));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getById(@PathVariable UUID workspaceId,
                                                                 @PathVariable UUID projectId,
                                                                 @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProjectById(workspaceId, projectId, user)));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> update(@PathVariable UUID workspaceId,
                                                                @PathVariable UUID projectId,
                                                                @Valid @RequestBody UpdateProjectRequest request,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(projectService.updateProject(workspaceId, projectId, request, user)));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID workspaceId,
                                                     @PathVariable UUID projectId,
                                                     @AuthenticationPrincipal User user) {
        projectService.deleteProject(workspaceId, projectId, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Project deleted"));
    }
}
