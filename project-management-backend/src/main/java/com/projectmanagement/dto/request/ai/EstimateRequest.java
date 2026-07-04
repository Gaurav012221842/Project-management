package com.projectmanagement.dto.request.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EstimateRequest {

    @NotBlank(message = "Title is required")
    private String taskTitle;

    private String taskDescription;
    private String taskType;
    private String teamSize;
    private String complexity;
}


//https://linktr.ee/hiringhubonline?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnZ9TxzB_wozcjQlPvXppUE0HkcFnVp8s7HI6kkv3DgG7y1uk72M8nmvnn2x0_aem_0RMYnoJcFudjYlKfIxF38Q