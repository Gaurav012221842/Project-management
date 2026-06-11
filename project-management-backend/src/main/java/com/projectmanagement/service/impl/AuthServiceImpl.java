package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.auth.*;
import com.projectmanagement.dto.response.auth.AuthResponse;
import com.projectmanagement.entity.PasswordResetToken;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.*;
import com.projectmanagement.repository.PasswordResetTokenRepository;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.security.JwtService;
import com.projectmanagement.service.interfaces.IAuthService;
import com.projectmanagement.service.interfaces.IFileStorageService;
import com.projectmanagement.utils.ValidationUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.UUID;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final EmailServiceImpl emailService;
    private final IFileStorageService fileStorageService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    @Transactional
    public AuthResponse register(
        RegisterRequest request
    ) {
        log.info(
            "Registering user with email: {}",
            request.getEmail()
        );
        String email = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException(
                "Email already registered"
            );
        }

        User user = User.builder()
            .name(request.getName())
            .email(email)
            .password(passwordEncoder.encode(
                request.getPassword()
            ))
            .build();

        User savedUser = userRepository.save(user);

        String accessToken = 
            jwtService.generateAccessToken(savedUser);
        String refreshToken = 
            jwtService.generateRefreshToken(savedUser);

        savedUser.setRefreshToken(refreshToken);
        userRepository.save(savedUser);

        // Send welcome email async
        emailService.sendWelcomeEmail(
            savedUser.getEmail(),
            savedUser.getName()
        );

        log.info(
            "User registered successfully: {}",
            savedUser.getId()
        );

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .user(AuthResponse.UserInfo.builder()
                .id(savedUser.getId().toString())
                .email(savedUser.getEmail())
                .fullName(savedUser.getName())
                .avatarUrl(fileStorageService.resolveFileUrl(savedUser.getProfilePic()))
                .role(savedUser.getRole().name())
                .build())
            .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        log.info(
            "Login attempt for: {}",
            email
        );

        Optional<User> loginUser = userRepository
            .findByEmailIgnoreCase(email);

        if (loginUser.isEmpty()) {
            log.warn("Login failed: no user found for email: {}", email);
        }

        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                email,
                request.getPassword()
            )
        );

        User user = userRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> 
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        String accessToken = 
            jwtService.generateAccessToken(user);
        String refreshToken = 
            jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .user(AuthResponse.UserInfo.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .fullName(user.getName())
                .avatarUrl(fileStorageService.resolveFileUrl(user.getProfilePic()))
                .role(user.getRole().name())
                .build())
            .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(
        RefreshTokenRequest request
    ) {
        String email = jwtService.extractUsername(
            request.getRefreshToken()
        );
        String normalizedEmail = normalizeEmail(email);

        User user = userRepository
            .findByEmailIgnoreCase(normalizedEmail)
            .orElseThrow(() -> 
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        if (!request.getRefreshToken()
                .equals(user.getRefreshToken())) {
            throw new UnauthorizedException(
                "Invalid refresh token"
            );
        }

        String newAccessToken = 
            jwtService.generateAccessToken(user);
        String newRefreshToken = 
            jwtService.generateRefreshToken(user);

        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return AuthResponse.builder()
            .accessToken(newAccessToken)
            .refreshToken(newRefreshToken)
            .user(AuthResponse.UserInfo.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .fullName(user.getName())
                .avatarUrl(fileStorageService.resolveFileUrl(user.getProfilePic()))
                .role(user.getRole().name())
                .build())
            .build();
    }
    @Override
    @Transactional
    public void forgotPassword(String email){
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
            .orElse(null);

        if (user == null) {
            log.info(
                "Password reset requested for unknown email: {}",
                normalizedEmail
            );
            return;
        }

        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(generateResetToken())
            .user(user)
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .build();

        passwordResetTokenRepository.save(resetToken);
        sendResetEmail(user, resetToken.getToken());
    }

    @Override
    @Transactional
    public void resetPassword(String token, ResetPasswordRequest request){
        if (token == null || token.isBlank()) {
            throw new BadRequestException("Reset token is required");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository
            .findByToken(token)
            .orElseThrow(() -> new BadRequestException(
                "Invalid or expired reset token"
            ));

        if (resetToken.isUsed() || resetToken.isExpired()) {
            throw new BadRequestException(
                "Invalid or expired reset token"
            );
        }

        if(!ValidationUtils.isValidPassword(request.getNewPassword())){
            throw new BadRequestException(
                "Password must contain uppercase, lowercase and number"
            );
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setRefreshToken(null);
        resetToken.markUsed();

        userRepository.save(user);
        passwordResetTokenRepository.save(resetToken);
    }

    private String generateResetToken(){
        return UUID.randomUUID().toString();
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private void sendResetEmail(User user, String resetToken){
        String resetUrl = UriComponentsBuilder
            .fromHttpUrl(frontendUrl)
            .path("/reset-password")
            .queryParam("token", resetToken)
            .build()
            .toUriString();

        emailService.sendPasswordResetEmail(
            user.getEmail(),
            resetUrl
        );
    }
}
