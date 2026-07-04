package com.projectmanagement.service;

import com.projectmanagement.dto.request.auth.LoginRequest;
import com.projectmanagement.dto.request.auth.RegisterRequest;
import com.projectmanagement.dto.response.auth.AuthResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.exception.custom.DuplicateResourceException;
import com.projectmanagement.repository.PasswordResetTokenRepository;
import com.projectmanagement.repository.UserRepository;
import com.projectmanagement.security.JwtService;
import com.projectmanagement.service.impl.AuthServiceImpl;
import com.projectmanagement.service.impl.EmailServiceImpl;
import com.projectmanagement.service.interfaces.IFileStorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

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
    @Mock
    private EmailServiceImpl emailService;
    @Mock
    private IFileStorageService fileStorageService;
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void register_ShouldThrow_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setName("Test User");
        request.setPassword("Password1");

        when(userRepository.existsByEmailIgnoreCase("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void register_ShouldReturnTokens_WhenValidRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setName("New User");
        request.setPassword("Password1");

        when(userRepository.existsByEmailIgnoreCase(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userRepository.save(any())).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            user.setId(UUID.randomUUID());
            return user;
        });
        when(jwtService.generateAccessToken(any())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh-token");
        when(fileStorageService.resolveFileUrl(any())).thenReturn("https://example.com/avatar.png");

        AuthResponse response = authService.register(request);

        assertThat(response.getAccessToken()).isNotNull();
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
    }

    @Test
    void login_ShouldUseSingleUserLookup_WhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@example.com");
        request.setPassword("Password1");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("user@example.com");
        user.setName("Test User");
        user.setPassword("encoded");
        user.setRole(com.projectmanagement.enums.Role.DEVELOPER);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.save(any())).thenReturn(user);
        when(jwtService.generateAccessToken(any())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh-token");

        authService.login(request);

        verify(userRepository, never()).findByEmailIgnoreCase(anyString());
        verify(userRepository, times(1)).save(any(User.class));
    }
}
