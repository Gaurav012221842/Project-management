// SendMessageRequest.java
package com.projectmanagement.dto.request.message;

import com.projectmanagement.enums.MessageType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendMessageRequest {

    @NotBlank(message = "Content is required")
    private String content;

    private MessageType messageType =
        MessageType.TEXT;

    private String fileUrl;
    private String fileName;
}

