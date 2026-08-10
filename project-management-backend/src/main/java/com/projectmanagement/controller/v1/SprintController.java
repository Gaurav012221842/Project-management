package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.sprint.CreateSprintRequest;
import com.projectmanagement.dto.request.sprint.UpdateSprintRequest;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.sprint.SprintResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.ISprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/sprints")
@RequiredArgsConstructor
@Tag(name = "Sprints", description = "Sprint management APIs")
public class SprintController {

    private final ISprintService sprintService;

    @PostMapping
    @Operation(summary = "Create new sprint")
    public ResponseEntity<ApiResponse<SprintResponse>> createSprint(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateSprintRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                sprintService.createSprint(projectId, request, user),
                "Sprint created successfully"
            ));
    }

    @GetMapping
    @Operation(summary = "Get all project sprints")
    public ResponseEntity<ApiResponse<List<SprintResponse>>> getSprints(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            ApiResponse.success(sprintService.getSprints(projectId, user))
        );
    }

    @GetMapping("/{sprintId}")
    @Operation(summary = "Get sprint by ID")
    public ResponseEntity<ApiResponse<SprintResponse>> getSprintById(
            @PathVariable UUID projectId,
            @PathVariable UUID sprintId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            ApiResponse.success(sprintService.getSprintById(projectId, sprintId, user))
        );
    }

    @PutMapping("/{sprintId}")
    @Operation(summary = "Update sprint")
    public ResponseEntity<ApiResponse<SprintResponse>> updateSprint(
            @PathVariable UUID projectId,
            @PathVariable UUID sprintId,
            @Valid @RequestBody UpdateSprintRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.updateSprint(projectId, sprintId, request, user),
                "Sprint updated successfully"
            )
        );
    }

    @DeleteMapping("/{sprintId}")
    @Operation(summary = "Delete sprint")
    public ResponseEntity<ApiResponse<Void>> deleteSprint(
            @PathVariable UUID projectId,
            @PathVariable UUID sprintId,
            @AuthenticationPrincipal User user) {
        sprintService.deleteSprint(projectId, sprintId, user);
        return ResponseEntity.ok(
            ApiResponse.success(null, "Sprint deleted successfully")
        );
    }

    @PostMapping("/{sprintId}/start")
    @Operation(summary = "Start a sprint")
    public ResponseEntity<ApiResponse<SprintResponse>> startSprint(
            @PathVariable UUID projectId,
            @PathVariable UUID sprintId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.startSprint(projectId, sprintId, user),
                "Sprint started!"
            )
        );
    }

    @PostMapping("/{sprintId}/complete")
    @Operation(summary = "Complete a sprint")
    public ResponseEntity<ApiResponse<SprintResponse>> completeSprint(
            @PathVariable UUID projectId,
            @PathVariable UUID sprintId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.completeSprint(projectId, sprintId, user),
                "Sprint completed!"
            )
        );
    }
}