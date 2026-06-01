package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.task.*;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.task.TaskResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.ITaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management APIs")
public class TaskController {

    private final ITaskService taskService;

    @PostMapping("/projects/{projectId}/tasks")
    @Operation(summary = "Create new task")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(taskService.createTask(projectId, request, user), "Task created successfully"));
    }

    @GetMapping("/projects/{projectId}/tasks")
    @Operation(summary = "Get all project tasks")
    public ResponseEntity<ApiResponse<PageResponse<TaskResponse>>> getTasks(
            @PathVariable UUID projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTasks(projectId, user, PageRequest.of(page, size))));
    }

    @GetMapping("/tasks/{taskId}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(taskService.getTaskById(taskId, user)));
    }

    @PutMapping("/tasks/{taskId}")
    @Operation(summary = "Update task")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(taskService.updateTask(taskId, request, user), "Task updated successfully"));
    }

    @PutMapping("/tasks/{taskId}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(taskService.updateTaskStatus(taskId, request, user), "Status updated successfully"));
    }

    @PutMapping("/tasks/{taskId}/assign")
    @Operation(summary = "Assign task")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody AssignTaskRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(taskService.assignTask(taskId, request, user)));
    }

    @DeleteMapping("/tasks/{taskId}")
    @Operation(summary = "Delete task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user) {
        taskService.deleteTask(taskId, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Task deleted successfully"));
    }
}
