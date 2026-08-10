package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.enums.MessageType;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.service.interfaces.IFileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/messages")
@RequiredArgsConstructor
public class ChatUploadController {

    private final IFileStorageService fileStorageService;
    private final ProjectRepository projectRepository;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadMessageFile(
        @PathVariable UUID projectId,
        @RequestParam("file") MultipartFile file,
        @AuthenticationPrincipal User currentUser
    ) {
        projectRepository.findById(projectId)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (currentUser == null) {
            throw new ResourceNotFoundException("Authenticated user not found");
        }

        String fileUrl = fileStorageService.uploadFile(file, "chat-files");
        MessageType messageType = file.getContentType() != null &&
            file.getContentType().startsWith("image/")
            ? MessageType.IMAGE
            : MessageType.FILE;

        return ResponseEntity.ok(
            ApiResponse.success(Map.of(
                "fileUrl", fileUrl,
                "fileName", file.getOriginalFilename(),
                "messageType", messageType
            ))
        );
    }
}
