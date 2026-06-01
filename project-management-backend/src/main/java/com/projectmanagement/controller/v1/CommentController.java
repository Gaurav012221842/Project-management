package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.comment.CreateCommentRequest;
import com.projectmanagement.dto.request.comment.UpdateCommentRequest;
import com.projectmanagement.dto.response.comment.CommentResponse;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.ICommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final ICommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> create(@PathVariable UUID taskId,
                                                                @Valid @RequestBody CreateCommentRequest request,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(commentService.createComment(taskId, request, user)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CommentResponse>>> getAll(@PathVariable UUID taskId,
                                                                              @RequestParam(defaultValue = "0") int page,
                                                                              @RequestParam(defaultValue = "20") int size,
                                                                              @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(commentService.getTaskComments(taskId, page, size, user)));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> update(@PathVariable UUID taskId,
                                                                @PathVariable UUID commentId,
                                                                @Valid @RequestBody UpdateCommentRequest request,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(commentService.updateComment(taskId, commentId, request, user)));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID taskId,
                                                     @PathVariable UUID commentId,
                                                     @AuthenticationPrincipal User user) {
        commentService.deleteComment(taskId, commentId, user);
        return ResponseEntity.ok(ApiResponse.<Void>success(null, "Comment deleted"));
    }
}
