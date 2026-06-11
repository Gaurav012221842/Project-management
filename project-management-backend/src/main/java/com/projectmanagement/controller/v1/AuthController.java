package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.auth.*;
import com.projectmanagement.dto.response.auth.AuthResponse;
import com.projectmanagement.dto.response.common.ApiResponse;
import com.projectmanagement.service.interfaces.IAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", 
     description = "Auth management APIs")
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new user")
    public ResponseEntity<ApiResponse<AuthResponse>> 
    register(
        @Valid @RequestBody RegisterRequest request
    ) {
        AuthResponse response = 
            authService.register(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(
                response, 
                "User registered successfully"
            ));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<ApiResponse<AuthResponse>> 
    login(
        @Valid @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                authService.login(request),
                "Login successful"
            )
        );
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> 
    refreshToken(
        @RequestBody RefreshTokenRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                authService.refreshToken(request)
            )
        );
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());

        return ResponseEntity.ok(
            ApiResponse.<Void>success(
                null,
                "If an account exists, a reset link has been sent"
            )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @RequestParam(required = false) String token,
            @Valid @RequestBody ResetPasswordRequest request) {
        String resetToken = token != null
            ? token
            : request.getToken();

        authService.resetPassword(resetToken, request);

        return ResponseEntity.ok(
            ApiResponse.<Void>success(
                null,
                "Password reset successful"
            )
        );
    }
}
