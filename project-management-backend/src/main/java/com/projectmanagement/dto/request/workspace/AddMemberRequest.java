package com.projectmanagement.dto.request.workspace;

import com.projectmanagement.enums.WorkspaceRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddMemberRequest {

    @NotBlank
    @Email
    private String email;

    @NotNull
    private WorkspaceRole role;
}
