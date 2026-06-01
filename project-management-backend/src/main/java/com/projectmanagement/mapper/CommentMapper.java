package com.projectmanagement.mapper;

import com.projectmanagement.dto.response.comment.CommentResponse;
import com.projectmanagement.entity.Comment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommentMapper {

    private final UserMapper userMapper;

    public CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId().toString())
                .content(comment.getContent())
                .user(userMapper.toResponse(comment.getAuthor()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
