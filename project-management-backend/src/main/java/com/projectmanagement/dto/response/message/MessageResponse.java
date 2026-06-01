// ================================

// MessageResponse.java
package com.projectmanagement.dto.response.message;

import com.projectmanagement.dto.response.user
    .UserResponse;
import com.projectmanagement.enums.MessageType;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private UUID        id;
    private String      content;
    private MessageType messageType;
    private String      fileUrl;
    private String      fileName;
    private UserResponse sender;
    private UUID        workspaceId;
    private boolean     isOwn;
    private LocalDateTime createdAt;
}