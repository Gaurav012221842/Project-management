package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.entity.Attachment;
import com.projectmanagement.entity.User;
import com.projectmanagement.repository.AttachmentRepository;
import com.projectmanagement.repository.TaskRepository;
import com.projectmanagement.service.interfaces.IFileStorageService;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks/{taskId}/attachments")
@RequiredArgsConstructor
public class AttachmentController {

    private final IFileStorageService fileStorageService;
    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> upload(@PathVariable UUID taskId,
                                                     @RequestParam("file") MultipartFile file,
                                                     @AuthenticationPrincipal User user) {
        var task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        String url = fileStorageService.uploadFile(file, "attachments");
        Attachment attachment = Attachment.builder()
                .task(task)
                .uploadedBy(user)
                .fileName(file.getOriginalFilename())
                .fileUrl(url)
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .build();
        attachmentRepository.save(attachment);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<Void>success(null, "File uploaded"));
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID taskId,
                                                     @PathVariable UUID attachmentId,
                                                     @AuthenticationPrincipal User user) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
        fileStorageService.deleteFile(attachment.getFileUrl());
        attachmentRepository.delete(attachment);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Attachment deleted"));
    }
}
