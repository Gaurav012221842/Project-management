package com.projectmanagement.dto.request.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, 
          message = "Name must be between 2-50 chars")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, 
          message = "Password min 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])" +
                 "(?=.*\\d).*$",
        message = "Password must contain uppercase," +
                  " lowercase and number"
    )
    private String password;
}