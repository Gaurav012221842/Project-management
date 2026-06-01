package com.projectmanagement.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanagement.dto.request.auth.RegisterRequest;
import com.projectmanagement.dto.request.project.CreateProjectRequest;
import com.projectmanagement.dto.request.workspace.CreateWorkspaceRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProjectIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String accessToken;
    private UUID workspaceId;

    @BeforeEach
    void setUp() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("proj@example.com");
        reg.setName("Proj User");
        reg.setPassword("Password1");

        MvcResult regResult = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andReturn();

        accessToken = objectMapper.readTree(regResult.getResponse().getContentAsString())
                .path("data").path("accessToken").asText();

        CreateWorkspaceRequest wsReq = new CreateWorkspaceRequest();
        wsReq.setName("My Workspace");

        MvcResult wsResult = mockMvc.perform(post("/api/v1/workspaces")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wsReq)))
                .andReturn();

        workspaceId = UUID.fromString(objectMapper.readTree(wsResult.getResponse().getContentAsString())
                .path("data").path("id").asText());
    }

    @Test
    void createProject_ShouldSucceed_WhenAuthenticated() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("Integration Project");

        mockMvc.perform(post("/api/v1/workspaces/{workspaceId}/projects", workspaceId)
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Integration Project"));
    }
}
