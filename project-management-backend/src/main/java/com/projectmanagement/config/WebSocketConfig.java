package com.projectmanagement.config;

import com.projectmanagement.security.JwtService;
import com.projectmanagement.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig
    implements WebSocketMessageBrokerConfigurer {

    private final JwtService             jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    // ============================
    // Configure Message Broker
    // ============================
    @Override
    public void configureMessageBroker(
        MessageBrokerRegistry registry
    ) {
        // Enable simple broker for topics & queues
        registry.enableSimpleBroker(
            "/topic",   // broadcast
            "/queue"    // private
        );

        // Prefix for messages from client to server
        registry.setApplicationDestinationPrefixes(
            "/app"
        );

        // Prefix for user-specific messages
        registry.setUserDestinationPrefix("/user");
    }

    // ============================
    // Register STOMP Endpoints
    // ============================
    @Override
    public void registerStompEndpoints(
        StompEndpointRegistry registry
    ) {
        registry
            .addEndpoint("/ws")
            .setAllowedOriginPatterns("*")
            .withSockJS();
    }

    // ============================
    // JWT Auth via WebSocket
    // ============================
    @Override
    public void configureClientInboundChannel(
        ChannelRegistration registration
    ) {
        registration.interceptors(
            new ChannelInterceptor() {
                @Override
                public Message<?> preSend(
                    Message<?> message,
                    MessageChannel channel
                ) {
                    StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(
                            message,
                            StompHeaderAccessor.class
                        );

                    if (accessor != null &&
                        StompCommand.CONNECT.equals(
                            accessor.getCommand()
                        )) {
                        String authHeader =
                            accessor.getFirstNativeHeader(
                                "Authorization"
                            );

                        if (authHeader != null &&
                            authHeader.startsWith(
                                "Bearer "
                            )) {
                            String token =
                                authHeader.substring(7);

                            try {
                                String email =
                                    jwtService
                                        .extractUsername(token);

                                UserDetails userDetails =
                                    userDetailsService
                                        .loadUserByUsername(
                                            email
                                        );

                                if (jwtService.isTokenValid(
                                        token, userDetails
                                    )) {
                                    UsernamePasswordAuthenticationToken
                                        auth =
                                        new UsernamePasswordAuthenticationToken(
                                            userDetails,
                                            null,
                                            userDetails
                                                .getAuthorities()
                                        );
                                    accessor.setUser(auth);
                                    log.info(
                                        "WS Connected: {}",
                                        email
                                    );
                                }
                            } catch (Exception e) {
                                log.error(
                                    "WS Auth failed: {}",
                                    e.getMessage()
                                );
                            }
                        }
                    }
                    return message;
                }
            }
        );
    }
}