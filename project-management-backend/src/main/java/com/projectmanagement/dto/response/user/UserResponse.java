package com.projectmanagement.dto.response.user;

import com.projectmanagement.enums.Role;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String name;
    private String email;
    private String profilePic;
    private Role role;
    private LocalDateTime createdAt;
}