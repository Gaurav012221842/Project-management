package com.projectmanagement.controller.websocket;

import com.projectmanagement.dto.request.message.SendMessageRequest;
import com.projectmanagement.service.interfaces.IMessageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class ChatWebSocketControllerTest {

    @Mock
    private IMessageService messageService;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatWebSocketController controller;

    @Test
    void sendMessageShouldIgnoreMissingPrincipal() {
        UUID projectId = UUID.randomUUID();
        SendMessageRequest request = new SendMessageRequest();
        request.setContent("Hello team");

        assertDoesNotThrow(() -> controller.sendMessage(projectId, request, null, null));

        verifyNoInteractions(messageService);
        verifyNoInteractions(messagingTemplate);
    }
}
