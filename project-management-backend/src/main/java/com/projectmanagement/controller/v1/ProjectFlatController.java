package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.request.project.UpdateProjectRequest;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.dto.response.project.ProjectStatsResponse;
import com.projectmanagement.dto.response.user.ActivityLogResponse;
import com.projectmanagement.entity.Project;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.IProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Flat (non workspace-scoped) project endpoints. Matches the
 * URLs the frontend uses: /api/v1/projects[/{id}...].
 * Workspace context is taken from the request body (create)
 * or resolved from the project entity (read/update/delete).
 */
@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectFlatController {

    private final IProjectService projectService;
    private final ProjectRepository projectRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> create(
            @Valid @RequestBody CreateProjectRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        projectService.createProject(request.getWorkspaceId(), request, user)));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getById(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user) {
        UUID workspaceId = resolveWorkspaceId(projectId);
        return ResponseEntity.ok(ApiResponse.success(
                projectService.getProjectById(workspaceId, projectId, user)));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> update(
            @PathVariable UUID projectId,
            @Valid @RequestBody UpdateProjectRequest request,
            @AuthenticationPrincipal User user) {
        UUID workspaceId = resolveWorkspaceId(projectId);
        return ResponseEntity.ok(ApiResponse.success(
                projectService.updateProject(workspaceId, projectId, request, user)));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user) {
        UUID workspaceId = resolveWorkspaceId(projectId);
        projectService.deleteProject(workspaceId, projectId, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Project deleted"));
    }

    @GetMapping("/{projectId}/stats")
    public ResponseEntity<ApiResponse<ProjectStatsResponse>> stats(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                projectService.getProjectStats(projectId, user)));
    }

    @GetMapping("/{projectId}/activity")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogResponse>>> activity(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                projectService.getProjectActivity(projectId, page, size, user)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProjectResponse>>> list(
            @RequestParam(required = false) UUID workspaceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User user) {
        if (workspaceId == null) {
            var pageResult = projectRepository.findByOwnerId(
                    user.getId(),
                    org.springframework.data.domain.PageRequest.of(page, size));
            return ResponseEntity.ok(ApiResponse.success(
                    PageResponse.<ProjectResponse>builder()
                            .content(pageResult.getContent().stream()
                                    .map(project -> projectService.getProjectById(
                                            project.getWorkspace().getId(),
                                            project.getId(),
                                            user))
                                    .toList())
                            .page(pageResult.getNumber())
                            .size(pageResult.getSize())
                            .totalElements(pageResult.getTotalElements())
                            .totalPages(pageResult.getTotalPages())
                            .first(pageResult.isFirst())
                            .last(pageResult.isLast())
                            .build()));
        }
        return ResponseEntity.ok(ApiResponse.success(
                projectService.getWorkspaceProjects(workspaceId, page, size, user)));
    }

    private UUID resolveWorkspaceId(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Project not found: " + projectId));
        return project.getWorkspace().getId();
    }
}
