package com.projectmanagement.service.impl;

import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.user.ActivityLogResponse;
import com.projectmanagement.dto.response.user.UserResponse;
import com.projectmanagement.dto.response.user.UserStatsResponse;
import com.projectmanagement.dto.response.user.UserSummaryResponse;
import com.projectmanagement.entity.Task;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.BadRequestException;
import com.projectmanagement.exception.custom.ResourceNotFoundException;
import com.projectmanagement.mapper.UserMapper;
import com.projectmanagement.repository.ActivityLogRepository;
import com.projectmanagement.repository.CommentRepository;
import com.projectmanagement.repository.ProjectRepository;
import com.projectmanagement.repository.SprintRepository;
import com.projectmanagement.repository.TaskRepository;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.service.interfaces.IFileStorageService;
import com.projectmanagement.service.interfaces.IUserService;
import com.projectmanagement.enums.SprintStatus;
import com.projectmanagement.enums.TaskStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final SprintRepository sprintRepository;
    private final IFileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse getCurrentUser(User user) {
        UserResponse response = userMapper.toResponse(user);
        response.setProfilePic(fileStorageService.resolveFileUrl(response.getProfilePic()));
        return response;
    }

    @Override
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        UserResponse response = userMapper.toResponse(user);
        response.setProfilePic(fileStorageService.resolveFileUrl(response.getProfilePic()));
        return response;
    }

    @Override
    @Transactional
    public UserResponse updateProfile(User user, String fullName, String avatarUrl) {
        if (fullName != null) user.setName(fullName);
        if (avatarUrl != null) user.setProfilePic(avatarUrl);
        UserResponse response = userMapper.toResponse(userRepository.save(user));
        response.setProfilePic(fileStorageService.resolveFileUrl(response.getProfilePic()));
        return response;
    }

    @Override
    @Transactional
    public void changePassword(User user, String currentPassword, String newPassword) {
        User persistedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user.getId()));

        if (!passwordEncoder.matches(currentPassword, persistedUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (passwordEncoder.matches(newPassword, persistedUser.getPassword())) {
            throw new BadRequestException("New password must be different from current password");
        }

        persistedUser.setPassword(passwordEncoder.encode(newPassword));
        persistedUser.setRefreshToken(null);
        userRepository.save(persistedUser);
    }

    @Override
    public PageResponse<ActivityLogResponse> getUserActivity(
            User user,
            int page,
            int size
    ) {
        PageRequest pageRequest = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<com.projectmanagement.entity.ActivityLog> activityPage =
                activityLogRepository.findByUserIdOrderByCreatedAtDesc(
                        user.getId(),
                        pageRequest
                );
        Page<ActivityLogResponse> responsePage = activityPage.map(activity -> ActivityLogResponse.builder()
                .id(activity.getId())
                .action(activity.getAction())
                .entityType(activity.getEntityType())
                .entityId(activity.getEntityId())
                .oldValue(activity.getOldValue())
                .newValue(activity.getNewValue())
                .createdAt(activity.getCreatedAt())
                .build());

        return PageResponse.<ActivityLogResponse>builder()
                .content(responsePage.getContent())
                .page(responsePage.getNumber())
                .size(responsePage.getSize())
                .totalElements(responsePage.getTotalElements())
                .totalPages(responsePage.getTotalPages())
                .first(responsePage.isFirst())
                .last(responsePage.isLast())
                .build();
    }

    @Override
    public UserStatsResponse getUserStats(User user) {
        List<Task> tasks = taskRepository.findByAssigneeId(user.getId());
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.DONE)
                .count();
        long inProgressTasks = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS
                        || task.getStatus() == TaskStatus.IN_REVIEW)
                .count();
        long totalStoryPoints = tasks.stream()
                .mapToLong(task -> task.getStoryPoints() == null
                        ? 0L
                        : task.getStoryPoints())
                .sum();
        long totalComments = commentRepository.countByAuthorId(user.getId());
        long totalProjects = projectRepository.countByOwnerId(user.getId());
        int completionRate = totalTasks == 0
                ? 0
                : (int) Math.round(100.0 * completedTasks / totalTasks);

        long completedSprints = 0L;
        List<com.projectmanagement.entity.Project> ownedProjects =
                projectRepository.findByOwnerId(user.getId());
        if (!ownedProjects.isEmpty()) {
            completedSprints = ownedProjects.stream()
                    .mapToLong(project -> sprintRepository
                            .countByProjectIdAndStatus(
                                    project.getId(),
                                    SprintStatus.COMPLETED)
                            )
                    .sum();
        }

        return UserStatsResponse.builder()
                .totalProjects(totalProjects)
                .completedTasks(completedTasks)
                .inProgressTasks(inProgressTasks)
                .totalStoryPoints(totalStoryPoints)
                .totalComments(totalComments)
                .completionRate(completionRate)
                .completedSprints(completedSprints)
                .build();
    }

    @Override
    public java.util.List<UserSummaryResponse> searchUsers(String query) {
        if (query == null || query.isBlank()) {
            return java.util.Collections.emptyList();
        }

        return userRepository.searchUsers(query).stream()
                .map(user -> UserSummaryResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .profilePic(fileStorageService.resolveFileUrl(user.getProfilePic()))
                        .build())
                .toList();
    }
}
