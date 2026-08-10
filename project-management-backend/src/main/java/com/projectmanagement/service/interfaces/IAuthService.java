package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.auth.*;
import com.projectmanagement.dto.response.auth.AuthResponse;
import com.projectmanagement.entity.User;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void forgotPassword(String email);
    void resetPassword(String token, ResetPasswordRequest request);
    void logout(User user);
}
