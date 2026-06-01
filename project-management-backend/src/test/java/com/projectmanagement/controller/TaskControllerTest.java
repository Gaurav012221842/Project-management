package com.projectmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanagement.dto.request.task.CreateTaskRequest;
import com.projectmanagement.dto.response.task.TaskResponse;
import com.projectmanagement.service.interfaces.ITaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ITaskService taskService;

    @Test
    @WithMockUser
    void createTask_ShouldReturn201_WhenValidRequest() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Fix login bug");

        TaskResponse response = TaskResponse.builder()
                .id(UUID.randomUUID().toString())
                .title("Fix login bug")
                .build();

        when(taskService.createTask(any(), any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/projects/{projectId}/tasks", UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.title").value("Fix login bug"));
    }
}
