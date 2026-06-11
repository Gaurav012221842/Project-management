package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.user.ChangePasswordRequest;
import com.projectmanagement.dto.request.user.UpdateProfileRequest;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.dto.response.common.PageResponse;
import com.projectmanagement.dto.response.user.ActivityLogResponse;
import com.projectmanagement.dto.response.user.UserResponse;
import com.projectmanagement.dto.response.user.UserStatsResponse;
import com.projectmanagement.dto.response.user.UserSummaryResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.IFileStorageService;
import com.projectmanagement.service.interfaces.IUserService;
import com.projectmanagement.utils.FileUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final IFileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser(user)));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getAuthenticatedUserProfile(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser(user)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateProfileRequest request) {
        UserResponse updated = userService.updateProfile(user, request.getName(), null);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(
                user,
                request.getCurrentPassword(),
                request.getNewPassword()
        );
        return ResponseEntity.ok(
                ApiResponse.<Void>success(null, "Password changed successfully")
        );
    }

    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<PageResponse<ActivityLogResponse>>> getUserActivity(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserActivity(user, page, size)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<UserStatsResponse>> getUserStats(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserStats(user)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserSummaryResponse>>> searchUsers(
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(userService.searchUsers(query)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }
    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserResponse>> uploadAvatar(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {

        if (!FileUtils.isAllowedImageType(file) || !FileUtils.isWithinSizeLimit(file)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid image file"));
        }

        String url = fileStorageService.uploadFile(file, "avatars");
        UserResponse updated = userService.updateProfile(user, null, url);
        return ResponseEntity.ok(ApiResponse.success(updated));
    }   
}
