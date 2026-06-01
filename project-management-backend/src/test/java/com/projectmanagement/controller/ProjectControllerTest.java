package com.projectmanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.response.project.ProjectResponse;
import com.projectmanagement.entity.User;
import com.projectmanagement.service.interfaces.IProjectService;
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
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IProjectService projectService;

    @Test
    @WithMockUser
    void createProject_ShouldReturn201_WhenValidRequest() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("My Project");

        ProjectResponse response = ProjectResponse.builder()
                .id(UUID.randomUUID().toString())
                .name("My Project")
                .build();

        when(projectService.createProject(any(), any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/workspaces/{workspaceId}/projects", UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("My Project"));
    }
}
