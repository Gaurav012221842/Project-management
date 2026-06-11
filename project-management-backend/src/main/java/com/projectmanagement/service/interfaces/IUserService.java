package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.user.ActivityLogResponse;
import com.projectmanagement.dto.response.user.UserResponse;
import com.projectmanagement.dto.response.user.UserStatsResponse;
import com.projectmanagement.dto.response.user.UserSummaryResponse;
import com.projectmanagement.entity.User;

import java.util.List;
import java.util.UUID;

public interface IUserService {
    UserResponse getCurrentUser(User user);
    UserResponse getUserById(UUID id);
    UserResponse updateProfile(User user, String fullName, String avatarUrl);
    void changePassword(User user, String currentPassword, String newPassword);
    PageResponse<ActivityLogResponse> getUserActivity(User user, int page, int size);
    UserStatsResponse getUserStats(User user);
    List<UserSummaryResponse> searchUsers(String query);
}
