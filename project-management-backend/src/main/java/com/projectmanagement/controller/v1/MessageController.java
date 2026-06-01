package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.response.common
    .ApiResponse;
import com.projectmanagement.dto.response.common
    .PageResponse;
import com.projectmanagement.dto.response.message
    .MessageResponse;
import com.projectmanagement.service.interfaces
    .IMessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(
    name        = "Chat",
    description = "Chat & Messaging APIs"
)
public class MessageController {

    private final IMessageService messageService;

    @GetMapping("/{projectId}/messages")
    @Operation(summary = "Get project messages")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>>
    getMessages(
        @PathVariable UUID projectId,
        @RequestParam(defaultValue = "0")  int page,
        @RequestParam(defaultValue = "30") int size
    ) {
        PageRequest pageable = PageRequest.of(
            page, size,
            Sort.by("createdAt").descending()
        );

        return ResponseEntity.ok(
            ApiResponse.success(
                messageService
                    .getMessages(projectId, pageable)
            )
        );
    }

    @DeleteMapping("/{projectId}/messages/{messageId}")
    @Operation(summary = "Delete a message")
    public ResponseEntity<ApiResponse<Void>>
    deleteMessage(
        @PathVariable UUID projectId,
        @PathVariable UUID messageId
    ) {
        messageService.deleteMessage(
            messageId
        );
        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                "Message deleted"
            )
        );
    }

    @GetMapping("/{projectId}/messages/search")
    @Operation(summary = "Search messages")
    public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>>
    searchMessages(
        @PathVariable UUID projectId,
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        PageRequest pageable = PageRequest.of(
            page, size
        );
        return ResponseEntity.ok(
            ApiResponse.success(
                messageService.searchMessages(
                    projectId, query, pageable
                )
            )
        );
    }
}