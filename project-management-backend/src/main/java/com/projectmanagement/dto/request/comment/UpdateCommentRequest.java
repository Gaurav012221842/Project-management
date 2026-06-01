package com.projectmanagement.dto.request.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateCommentRequest {

    @NotBlank
    private String content;
}
