package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.comment.CreateCommentRequest;
import com.projectmanagement.dto.request.comment.UpdateCommentRequest;
import com.projectmanagement.dto.response.comment.CommentResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.entity.Comment;
import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.exception.custom.UnauthorizedException;
import com.projectmanagement.mapper.CommentMapper;
import com.projectmanagement.repository.CommentRepository;
import com.projectmanagement.repository.TaskRepository;
import com.projectmanagement.repository.WorkspaceMemberRepository;
import com.projectmanagement.service.interfaces.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements ICommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final CommentMapper commentMapper;

    @Override
    @Transactional
    public CommentResponse createComment(UUID taskId, CreateCommentRequest request, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        verifyAccess(task, user);
        Comment comment = Comment.builder()
                .task(task)
                .author(user)
                .content(request.getContent())
                .build();
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    public PageResponse<CommentResponse> getTaskComments(UUID taskId, int page, int size, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        verifyAccess(task, user);
        Page<Comment> pageResult = commentRepository.findByTaskId(taskId, PageRequest.of(page, size));
        return PageResponse.<CommentResponse>builder()
                .content(pageResult.getContent().stream().map(commentMapper::toResponse).toList())
                .page(pageResult.getNumber())
                .size(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .first(pageResult.isFirst())
                .last(pageResult.isLast())
                .build();
    }

    @Override
    @Transactional
    public CommentResponse updateComment(UUID taskId, UUID commentId, UpdateCommentRequest request, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }
        comment.setContent(request.getContent());
        return commentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    @Transactional
    public void deleteComment(UUID taskId, UUID commentId, User user) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
        if (!comment.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    private void verifyAccess(Task task, User user) {
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(task.getProject().getWorkspace().getId(), user.getId())) {
            throw new UnauthorizedException("Access denied");
        }
    }
}
