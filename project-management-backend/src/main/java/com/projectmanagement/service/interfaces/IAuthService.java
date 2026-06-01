package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.auth.*;
import com.projectmanagement.dto.response.auth.AuthResponse;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
}
