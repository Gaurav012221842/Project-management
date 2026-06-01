package com.projectmanagement.mapper;

import com.projectmanagement.dto.response.user.UserResponse;
import com.projectmanagement.dto.response.user.UserSummaryResponse;
import com.projectmanagement.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePic(user.getProfilePic())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public UserSummaryResponse toSummary(User user) {
        if (user == null) return null;
        return UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .profilePic(user.getProfilePic())
                .build();
    }
}
