package com.projectmanagement.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmanagement.dto.request.ai.*;
import com.projectmanagement.dto.response.ai.*;
import com.projectmanagement.entity.Project;
import com.projectmanagement.exception.custom
    .AIServiceException;
import com.projectmanagement.repository
    .ProjectRepository;
import com.projectmanagement.repository
    .TaskRepository;
import com.projectmanagement.service.interfaces
    .IAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation
    .Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIServiceImpl implements IAIService {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    @Value("${openai.max-tokens:800}")
    private Integer maxTokens;

    private final RestTemplate    restTemplate;
    private final ObjectMapper    objectMapper;
    private final ProjectRepository projectRepository;
    private final TaskRepository    taskRepository;

    private static final String OPENAI_URL =
        "https://api.openai.com/v1/chat/completions";

    private static final String SYSTEM_PROMPT = """
        You are an expert AI assistant for a project
        management tool. You help teams plan, estimate,
        and manage software development projects.
        Be concise, practical and professional.
        Always respond in valid JSON when asked.
        """;

    // ============================
    // Generate Description
    // ============================
    @Override
    public AITextResponse generateDescription(
        GenerateDescriptionRequest request
    ) {
        log.info(
            "Generating description for: {}",
            request.getTaskTitle()
        );

        String prompt = String.format("""
            Generate a professional task description for:
            
            Task Title: %s
            Task Type:  %s
            Project:    %s
            
            Include:
            - Clear objective (1-2 sentences)
            - Acceptance criteria (3-5 bullet points)
            - Technical implementation notes
            - Definition of done
            
            Keep it concise and actionable.
            """,
            request.getTaskTitle(),
            Optional.ofNullable(request.getTaskType())
                .orElse("TASK"),
            Optional.ofNullable(request.getProjectContext())
                .orElse("Software Project")
        );

        String response = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        return AITextResponse.builder()
            .text(response)
            .model(model)
            .build();
    }

    // ============================
    // Suggest Priority
    // ============================
    @Override
    public AIPriorityResponse suggestPriority(
        SuggestPriorityRequest request
    ) {
        log.info(
            "Suggesting priority for: {}",
            request.getTaskTitle()
        );

        String prompt = String.format("""
            Analyze and suggest priority for this task:
            
            Title:       %s
            Description: %s
            Type:        %s
            
            Respond ONLY with valid JSON:
            {
              "suggestedPriority": "HIGH",
              "reason": "Brief reason here",
              "confidence": 85,
              "alternativePriority": "CRITICAL"
            }
            
            Priority levels: LOW, MEDIUM, HIGH, CRITICAL
            Confidence: 0-100
            """,
            request.getTaskTitle(),
            Optional.ofNullable(request.getTaskDescription())
                .orElse("N/A"),
            Optional.ofNullable(request.getTaskType())
                .orElse("TASK")
        );

        String jsonResponse = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        try {
            return objectMapper.readValue(
                jsonResponse,
                AIPriorityResponse.class
            );
        } catch (Exception e) {
            log.error("Failed to parse AI response: {}",
                e.getMessage());
            return AIPriorityResponse.builder()
                .suggestedPriority("MEDIUM")
                .reason("Based on task description")
                .confidence(60)
                .build();
        }
    }

    // ============================
    // Suggest Assignee
    // ============================
    @Override
    public AIAssigneeResponse suggestAssignee(
        SuggestAssigneeRequest request
    ) {
        String teamList = request.getTeamMembers() != null
            ? String.join(", ", request.getTeamMembers())
            : "No team info provided";

        String prompt = String.format("""
            Suggest the best team member for this task:
            
            Task:    %s
            Type:    %s
            Team:    %s
            
            Respond ONLY with valid JSON:
            {
              "suggestedAssignee": "member name",
              "reason": "Why this person",
              "confidence": 80,
              "alternativeAssignees": ["name1","name2"],
              "requiredSkills": ["skill1","skill2"]
            }
            """,
            request.getTaskTitle(),
            Optional.ofNullable(request.getTaskType())
                .orElse("TASK"),
            teamList
        );

        String jsonResponse = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        try {
            return objectMapper.readValue(
                jsonResponse,
                AIAssigneeResponse.class
            );
        } catch (Exception e) {
            return AIAssigneeResponse.builder()
                .suggestedAssignee("Unassigned")
                .reason("Could not determine")
                .confidence(0)
                .build();
        }
    }

    // ============================
    // Analyze Bug
    // ============================
    @Override
    public AIBugAnalysisResponse analyzeBug(
        AnalyzeBugRequest request
    ) {
        log.info("Analyzing bug: {}",
            request.getBugDescription()
                .substring(
                    0,
                    Math.min(50,
                        request.getBugDescription()
                            .length()
                    )
                )
        );

        String prompt = String.format("""
            Analyze this bug report:
            
            Description: %s
            Error Log:   %s
            Component:   %s
            Steps:       %s
            
            Respond ONLY with valid JSON:
            {
              "severity": "HIGH",
              "rootCause": "Description of root cause",
              "possibleFixes": ["fix1","fix2","fix3"],
              "preventionTips": ["tip1","tip2"],
              "suggestedPriority": "HIGH",
              "estimatedFixTime": 4,
              "affectedArea": "Authentication Module"
            }
            
            Severity: LOW/MEDIUM/HIGH/CRITICAL
            estimatedFixTime: hours
            """,
            request.getBugDescription(),
            Optional.ofNullable(request.getErrorLog())
                .orElse("No error log"),
            Optional.ofNullable(request.getAffectedComponent())
                .orElse("Unknown"),
            Optional.ofNullable(request.getStepsToReproduce())
                .orElse("Not provided")
        );

        String jsonResponse = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        try {
            return objectMapper.readValue(
                jsonResponse,
                AIBugAnalysisResponse.class
            );
        } catch (Exception e) {
            return AIBugAnalysisResponse.builder()
                .severity("MEDIUM")
                .rootCause("Unable to analyze")
                .possibleFixes(List.of(
                    "Review error logs",
                    "Debug the affected component"
                ))
                .build();
        }
    }

    // ============================
    // Generate Sprint Goal
    // ============================
    @Override
    public AITextResponse generateSprintGoal(
        GenerateSprintGoalRequest request
    ) {
        String tasksList = request.getPlannedTasks() != null
            ? String.join("\n- ", request.getPlannedTasks())
            : "No tasks listed";

        String prompt = String.format("""
            Generate a clear sprint goal for:
            
            Sprint:    %s
            Project:   %s
            Tasks:
            - %s
            
            Previous Goal: %s
            
            Write a concise, motivating sprint goal
            (2-3 sentences) that captures the
            sprint's purpose and business value.
            """,
            Optional.ofNullable(request.getSprintName())
                .orElse("New Sprint"),
            Optional.ofNullable(request.getProjectContext())
                .orElse("Software Project"),
            tasksList,
            Optional.ofNullable(request.getPreviousSprintGoal())
                .orElse("N/A")
        );

        String response = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        return AITextResponse.builder()
            .text(response)
            .model(model)
            .build();
    }

    // ============================
    // Estimate Story Points
    // ============================
    @Override
    public AIEstimateResponse estimateStoryPoints(
        EstimateRequest request
    ) {
        String prompt = String.format("""
            Estimate story points for this task:
            
            Title:       %s
            Description: %s
            Type:        %s
            Complexity:  %s
            
            Use Fibonacci scale: 1,2,3,5,8,13,21
            
            Respond ONLY with valid JSON:
            {
              "storyPoints": 5,
              "complexityLevel": "MEDIUM",
              "reason": "Why this estimate",
              "timeEstimate": "2-3 days",
              "confidence": 75
            }
            
            complexityLevel: LOW/MEDIUM/HIGH/VERY_HIGH
            """,
            request.getTaskTitle(),
            Optional.ofNullable(request.getTaskDescription())
                .orElse("N/A"),
            Optional.ofNullable(request.getTaskType())
                .orElse("TASK"),
            Optional.ofNullable(request.getComplexity())
                .orElse("MEDIUM")
        );

        String jsonResponse = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        try {
            return objectMapper.readValue(
                jsonResponse,
                AIEstimateResponse.class
            );
        } catch (Exception e) {
            return AIEstimateResponse.builder()
                .storyPoints(3)
                .complexityLevel("MEDIUM")
                .reason("Default estimate")
                .confidence(50)
                .build();
        }
    }

    // ============================
    // Generate Sub-Tasks
    // ============================
    @Override
    public AISubTasksResponse generateSubTasks(
        GenerateSubTasksRequest request
    ) {
        int max = Optional.ofNullable(
            request.getMaxSubTasks()
        ).orElse(5);

        String prompt = String.format("""
            Break this task into sub-tasks:
            
            Title:       %s
            Description: %s
            Type:        %s
            Max Items:   %d
            
            Respond ONLY with valid JSON:
            {
              "subTasks": [
                {
                  "title": "Sub-task title",
                  "description": "Brief desc",
                  "estimatedHours": 2,
                  "priority": "MEDIUM"
                }
              ],
              "estimatedTotalTime": 10
            }
            """,
            request.getTaskTitle(),
            Optional.ofNullable(request.getTaskDescription())
                .orElse("N/A"),
            Optional.ofNullable(request.getTaskType())
                .orElse("TASK"),
            max
        );

        String jsonResponse = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        try {
            return objectMapper.readValue(
                jsonResponse,
                AISubTasksResponse.class
            );
        } catch (Exception e) {
            return AISubTasksResponse.builder()
                .subTasks(List.of())
                .build();
        }
    }

    // ============================
    // Chat with AI
    // ============================
    @Override
    public AITextResponse chat(AIChatRequest request) {
        List<Map<String, String>> messages =
            new ArrayList<>();

        // System message
        String systemMsg = SYSTEM_PROMPT;
        if (request.getProjectContext() != null) {
            systemMsg += "\n\nProject Context: " +
                request.getProjectContext();
        }
        messages.add(buildMessage("system", systemMsg));

        // Chat history
        if (request.getHistory() != null) {
            request.getHistory().forEach(h ->
                messages.add(
                    buildMessage(h.getRole(), h.getContent())
                )
            );
        }

        // Current message
        messages.add(
            buildMessage("user", request.getMessage())
        );

        String response = callOpenAI(messages);

        return AITextResponse.builder()
            .text(response)
            .model(model)
            .build();
    }

    // ============================
    // Summarize Project
    // ============================
    @Override
    public AITextResponse summarizeProject(
        SummarizeProjectRequest request
    ) {
        Project project = projectRepository
            .findById(request.getProjectId())
            .orElseThrow();

        long total = taskRepository
            .countByProjectId(request.getProjectId());
        long completed = taskRepository
            .countByProjectIdAndStatus(
                request.getProjectId(),
                com.projectmanagement.enums
                    .TaskStatus.DONE
            );

        int progress = total == 0 ? 0 :
            (int) Math.round(
                (double) completed / total * 100
            );

        String prompt = String.format("""
            Summarize this project status:
            
            Project:   %s
            Progress:  %d%% (%d/%d tasks done)
            Status:    %s
            Focus:     %s
            
            Provide:
            1. Overall health assessment
            2. Key achievements
            3. Current blockers or risks
            4. Recommended next steps
            
            Be concise (200-300 words).
            """,
            project.getName(),
            progress,
            completed,
            total,
            project.getStatus().name(),
            Optional.ofNullable(request.getFocusArea())
                .orElse("Overall")
        );

        String response = callOpenAI(
            List.of(
                buildMessage("system", SYSTEM_PROMPT),
                buildMessage("user",   prompt)
            )
        );

        return AITextResponse.builder()
            .text(response)
            .model(model)
            .build();
    }

    // ============================
    // Core OpenAI API Call
    // ============================
    private String callOpenAI(
        List<Map<String, String>> messages
    ) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("OpenAI API key is missing; returning fallback response");
            return "AI features are currently unavailable because the OpenAI API key is not configured.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(apiKey);
            headers.setContentType(
                MediaType.APPLICATION_JSON
            );
            log.info("Calling OpenAI API with model: {}, api_key: {}", model, apiKey);
            Map<String, Object> requestBody = Map.of(
                "model",       model,
                "messages",    messages,
                "max_tokens",  maxTokens,
                "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response =
                restTemplate.postForEntity(
                    OPENAI_URL,
                    entity,
                    Map.class
                );

            if (response.getStatusCode().is2xxSuccessful()
                && response.getBody() != null) {

                List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) 
                    response.getBody().get("choices");

                Map<String, Object> message =
                    (Map<String, Object>)
                    choices.get(0).get("message");

                String content =
                    (String) message.get("content");

                return content == null ? "" : content
                    .trim()
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();
            }

            log.warn("OpenAI returned an empty or unsuccessful response");
            return "AI features are temporarily unavailable. Please try again later.";

        } catch (Exception e) {
            String errorMessage = e.getMessage() == null ? "unknown error" : e.getMessage();
            log.error("OpenAI API error: {}", errorMessage);

            if (errorMessage.contains("429") || errorMessage.contains("insufficient_quota") || errorMessage.contains("quota")) {
                return "AI features are temporarily unavailable because the OpenAI quota has been exhausted.";
            }

            return "AI features are temporarily unavailable. Please try again later.";
        }
    }

    private Map<String, String> buildMessage(
        String role,
        String content
    ) {
        Map<String, String> msg = new HashMap<>();
        msg.put("role",    role);
        msg.put("content", content);
        return msg;
    }
}