package com.projectmanagement.dto.response.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenResponse {
    private String accessToken;
    private String tokenType;
    private long expiresIn;
}
