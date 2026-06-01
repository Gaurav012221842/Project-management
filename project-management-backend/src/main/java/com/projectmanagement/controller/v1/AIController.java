package com.projectmanagement.controller.v1;

import com.projectmanagement.dto.request.ai.*;
import com.projectmanagement.dto.response.ai.*;
import com.projectmanagement.dto.response.common
    .ApiResponse;
import com.projectmanagement.service.interfaces
    .IAIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(
    name        = "AI Assistant",
    description = "OpenAI powered features"
)
public class AIController {

    private final IAIService aiService;

    @PostMapping("/generate-description")
    @Operation(summary = "Generate task description")
    public ResponseEntity<ApiResponse<AITextResponse>>
    generateDescription(
        @Valid @RequestBody
        GenerateDescriptionRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.generateDescription(request)
            )
        );
    }

    @PostMapping("/suggest-priority")
    @Operation(summary = "Suggest task priority")
    public ResponseEntity<ApiResponse<AIPriorityResponse>>
    suggestPriority(
        @Valid @RequestBody
        SuggestPriorityRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.suggestPriority(request)
            )
        );
    }

    @PostMapping("/suggest-assignee")
    @Operation(summary = "Suggest best assignee")
    public ResponseEntity<ApiResponse<AIAssigneeResponse>>
    suggestAssignee(
        @Valid @RequestBody
        SuggestAssigneeRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.suggestAssignee(request)
            )
        );
    }

    @PostMapping("/analyze-bug")
    @Operation(summary = "Analyze bug report")
    public ResponseEntity<ApiResponse<AIBugAnalysisResponse>>
    analyzeBug(
        @Valid @RequestBody
        AnalyzeBugRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.analyzeBug(request)
            )
        );
    }

    @PostMapping("/generate-sprint-goal")
    @Operation(summary = "Generate sprint goal")
    public ResponseEntity<ApiResponse<AITextResponse>>
    generateSprintGoal(
        @Valid @RequestBody
        GenerateSprintGoalRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.generateSprintGoal(request)
            )
        );
    }

    @PostMapping("/estimate-story-points")
    @Operation(summary = "Estimate story points")
    public ResponseEntity<ApiResponse<AIEstimateResponse>>
    estimateStoryPoints(
        @Valid @RequestBody
        EstimateRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.estimateStoryPoints(request)
            )
        );
    }

    @PostMapping("/generate-subtasks")
    @Operation(summary = "Generate sub-tasks")
    public ResponseEntity<ApiResponse<AISubTasksResponse>>
    generateSubTasks(
        @Valid @RequestBody
        GenerateSubTasksRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.generateSubTasks(request)
            )
        );
    }

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI Assistant")
    public ResponseEntity<ApiResponse<AITextResponse>>
    chat(
        @Valid @RequestBody
        AIChatRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.chat(request)
            )
        );
    }

    @PostMapping("/summarize-project")
    @Operation(summary = "Summarize project status")
    public ResponseEntity<ApiResponse<AITextResponse>>
    summarizeProject(
        @Valid @RequestBody
        SummarizeProjectRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                aiService.summarizeProject(request)
            )
        );
    }
}