package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.message
    .SendMessageRequest;
import com.projectmanagement.dto.response.common
    .PageResponse;
import com.projectmanagement.dto.response.message
    .MessageResponse;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface IMessageService {

    MessageResponse sendMessage(
        UUID projectId,
        String senderEmail,
        SendMessageRequest request
    );

    PageResponse<MessageResponse> getMessages(
        UUID projectId,
        Pageable pageable
    );

    void deleteMessage(UUID messageId);

    PageResponse<MessageResponse> searchMessages(
        UUID projectId,
        String query,
        Pageable pageable
    );
}