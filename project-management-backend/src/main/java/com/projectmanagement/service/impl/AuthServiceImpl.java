package com.projectmanagement.service.impl;

import com.projectmanagement.dto.request.auth.*;
import com.projectmanagement.dto.response.auth.AuthResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.*;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.security.JwtService;
import com.projectmanagement.service.interfaces.IAuthService;
import com.projectmanagement.service.interfaces.IFileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional
    public AuthResponse register(
        RegisterRequest request
    ) {
        log.info(
            "Registering user with email: {}",
            request.getEmail()
        );

        if (userRepository.existsByEmail(
                request.getEmail())) {
            throw new DuplicateResourceException(
                "Email already registered"
            );
        }

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
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
        log.info(
            "Login attempt for: {}",
            request.getEmail()
        );

        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = userRepository
            .findByEmail(request.getEmail())
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

        User user = userRepository
            .findByEmail(email)
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
}