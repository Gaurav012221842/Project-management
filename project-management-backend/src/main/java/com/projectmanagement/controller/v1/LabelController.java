package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.entity.Label;
import com.projectmanagement.entity.User;
import com.projectmanagement.repository.LabelRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/labels")
@RequiredArgsConstructor
public class LabelController {

    private final LabelRepository labelRepository;
    private final ProjectRepository projectRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Label>> create(@PathVariable UUID projectId,
                                                      @RequestParam String name,
                                                      @RequestParam String color,
                                                      @AuthenticationPrincipal User user) {
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        Label label = Label.builder().project(project).name(name).color(color).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(labelRepository.save(label)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAll(@PathVariable UUID projectId) {
        return ResponseEntity.ok(ApiResponse.success(labelRepository.findByProjectId(projectId)));
    }

    @DeleteMapping("/{labelId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID projectId, @PathVariable UUID labelId) {
        labelRepository.deleteById(labelId);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Label deleted"));
    }
}
