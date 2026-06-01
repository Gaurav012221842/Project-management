package com.projectmanagement.service;

import com.projectmanagement.dto.request.auth.LoginRequest;
import com.projectmanagement.dto.request.auth.RegisterRequest;
import com.projectmanagement.dto.response.auth.AuthResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.DuplicateResourceException;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.security.JwtService;
import com.projectmanagement.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_ShouldThrow_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setName("Test User");
        request.setPassword("Password1");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void register_ShouldReturnTokens_WhenValidRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setName("New User");
        request.setPassword("Password1");

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateAccessToken(any())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh-token");

        AuthResponse response = authService.register(request);

        assertThat(response.getAccessToken()).isNotNull();
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
    }
}
