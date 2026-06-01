package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.message
    .SendMessageRequest;
import com.projectmanagement.dto.response.common
    .PageResponse;
import com.projectmanagement.dto.response.message
    .MessageResponse;
import com.projectmanagement.dto.response.user
    .UserResponse;
import com.projectmanagement.entity.Message;
import com.projectmanagement.entity.Project;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom
    .ResourceNotFoundException;
import com.projectmanagement.exception.custom
    .UnauthorizedException;
import com.projectmanagement.repository
    .MessageRepository;
import com.projectmanagement.repository
    .ProjectRepository;
import com.projectmanagement.repository
    .UserRepository;
import com.projectmanagement.service.interfaces
    .IMessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
    .Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl
    implements IMessageService {

    private final MessageRepository messageRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository    userRepository;

    // ============================
    // Send Message
    // ============================
    @Override
    @Transactional
    public MessageResponse sendMessage(
        UUID projectId,
        String senderEmail,
        SendMessageRequest request
    ) {
        Project project = projectRepository
            .findById(projectId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Project not found"
                )
            );

        User sender = userRepository
            .findByEmail(senderEmail)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        Message message = Message.builder()
            .workspace(project.getWorkspace())
            .sender(sender)
            .content(request.getContent())
            .type(request.getMessageType())
            .fileUrl(request.getFileUrl())
            .build();

        Message saved = messageRepository
            .save(message);

        log.info(
            "Message sent by {} in project {}",
            senderEmail, projectId
        );

        return toResponse(saved, sender);
    }

    // ============================
    // Get Messages
    // ============================
    @Override
    public PageResponse<MessageResponse> getMessages(
        UUID projectId,
        Pageable pageable
    ) {
        Project project = projectRepository
            .findById(projectId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Project not found"
                )
            );

        Page<Message> page =
            messageRepository
                .findByWorkspaceIdOrderByCreatedAtDesc(
                    project.getWorkspace().getId(), pageable
                );

        // Reverse to show oldest first
        List<MessageResponse> messages =
            page.getContent()
                .stream()
                .map(m -> toResponse(m, null))
                .collect(Collectors.toList());

        java.util.Collections.reverse(messages);

        return PageResponse.<MessageResponse>builder()
            .content(messages)
            .page(page.getNumber())
            .totalPages(page.getTotalPages())
            .totalElements(page.getTotalElements())
            .size(page.getSize())
            .first(page.isFirst())
            .last(page.isLast())
            .build();
    }

    // ============================
    // Delete Message
    // ============================
    @Override
    @Transactional
    public void deleteMessage(UUID messageId) {
        Message message = messageRepository
            .findById(messageId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Message not found"
                )
            );
        messageRepository.delete(message);
    }

    // ============================
    // Search Messages
    // ============================
    @Override
    public PageResponse<MessageResponse> searchMessages(
        UUID projectId,
        String query,
        Pageable pageable
    ) {
        Project project = projectRepository
            .findById(projectId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Project not found"
                )
            );

        Page<Message> page =
            messageRepository
                .searchInWorkspace(
                    project.getWorkspace().getId(), query, pageable
                );

        List<MessageResponse> messages =
            page.getContent()
                .stream()
                .map(m -> toResponse(m, null))
                .collect(Collectors.toList());

        return PageResponse.<MessageResponse>builder()
            .content(messages)
            .page(page.getNumber())
            .totalPages(page.getTotalPages())
            .totalElements(page.getTotalElements())
            .build();
    }

    // ============================
    // Helper
    // ============================
    private MessageResponse toResponse(
        Message message,
        User currentUser
    ) {
        User sender = message.getSender();

        return MessageResponse.builder()
            .id(message.getId())
            .content(message.getContent())
            .messageType(message.getType())
            .fileUrl(message.getFileUrl())
            .workspaceId(message.getWorkspace().getId())
            .sender(
                UserResponse.builder()
                    .id(sender.getId())
                    .name(sender.getName())
                    .email(sender.getEmail())
                    .profilePic(sender.getProfilePic())
                    .build()
            )
            .isOwn(
                currentUser != null &&
                sender.getId()
                    .equals(currentUser.getId())
            )
            .createdAt(message.getCreatedAt())
            .build();
    }
}