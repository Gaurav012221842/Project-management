package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.comment.CreateCommentRequest;
import com.projectmanagement.dto.request.comment.UpdateCommentRequest;
import com.projectmanagement.dto.response.comment.CommentResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.entity.User;

import java.util.UUID;

public interface ICommentService {
    CommentResponse createComment(UUID taskId, CreateCommentRequest request, User user);
    PageResponse<CommentResponse> getTaskComments(UUID taskId, int page, int size, User user);
    CommentResponse updateComment(UUID taskId, UUID commentId, UpdateCommentRequest request, User user);
    void deleteComment(UUID taskId, UUID commentId, User user);
}
