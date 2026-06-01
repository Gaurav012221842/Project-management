package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.sprint
    .CreateSprintRequest;
import com.projectmanagement.dto.request.sprint
    .UpdateSprintRequest;
import com.projectmanagement.dto.response.common
    .ApiResponse;
import com.projectmanagement.dto.response.sprint
    .SprintResponse;
import com.projectmanagement.service.interfaces
    .ISprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/sprints")
@RequiredArgsConstructor
@Tag(
    name        = "Sprints",
    description = "Sprint management APIs"
)
public class SprintController {

    private final ISprintService sprintService;

    // ============================
    // Create Sprint
    // ============================
    @PostMapping
    @Operation(summary = "Create new sprint")
    public ResponseEntity<ApiResponse<SprintResponse>>
    createSprint(
        @PathVariable UUID projectId,
        @Valid @RequestBody CreateSprintRequest request
    ) {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                sprintService.createSprint(
                    projectId, request
                ),
                "Sprint created successfully"
            ));
    }

    // ============================
    // Get All Sprints
    // ============================
    @GetMapping
    @Operation(summary = "Get all project sprints")
    public ResponseEntity<ApiResponse<List<SprintResponse>>>
    getSprints(
        @PathVariable UUID projectId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.getSprints(projectId)
            )
        );
    }

    // ============================
    // Get Sprint By ID
    // ============================
    @GetMapping("/{sprintId}")
    @Operation(summary = "Get sprint by ID")
    public ResponseEntity<ApiResponse<SprintResponse>>
    getSprintById(
        @PathVariable UUID projectId,
        @PathVariable UUID sprintId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.getSprintById(
                    projectId, sprintId
                )
            )
        );
    }

    // ============================
    // Update Sprint
    // ============================
    @PutMapping("/{sprintId}")
    @Operation(summary = "Update sprint")
    public ResponseEntity<ApiResponse<SprintResponse>>
    updateSprint(
        @PathVariable UUID projectId,
        @PathVariable UUID sprintId,
        @Valid @RequestBody UpdateSprintRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.updateSprint(
                    projectId, sprintId, request
                ),
                "Sprint updated successfully"
            )
        );
    }

    // ============================
    // Delete Sprint
    // ============================
    @DeleteMapping("/{sprintId}")
    @Operation(summary = "Delete sprint")
    public ResponseEntity<ApiResponse<Void>>
    deleteSprint(
        @PathVariable UUID projectId,
        @PathVariable UUID sprintId
    ) {
        sprintService.deleteSprint(
            projectId, sprintId
        );
        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Sprint deleted successfully"
            )
        );
    }

    // ============================
    // Start Sprint
    // ============================
    @PostMapping("/{sprintId}/start")
    @Operation(summary = "Start a sprint")
    public ResponseEntity<ApiResponse<SprintResponse>>
    startSprint(
        @PathVariable UUID projectId,
        @PathVariable UUID sprintId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.startSprint(
                    projectId, sprintId
                ),
                "Sprint started!"
            )
        );
    }

    // ============================
    // Complete Sprint
    // ============================
    @PostMapping("/{sprintId}/complete")
    @Operation(summary = "Complete a sprint")
    public ResponseEntity<ApiResponse<SprintResponse>>
    completeSprint(
        @PathVariable UUID projectId,
        @PathVariable UUID sprintId
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                sprintService.completeSprint(
                    projectId, sprintId
                ),
                "Sprint completed!"
            )
        );
    }
}