package com.projectmanagement.service.interfaces;

import com.projectmanagement.dto.request.ai.*;
import com.projectmanagement.dto.response.ai.*;

public interface IAIService {

    AITextResponse generateDescription(
        GenerateDescriptionRequest request
    );

    AIPriorityResponse suggestPriority(
        SuggestPriorityRequest request
    );

    AIAssigneeResponse suggestAssignee(
        SuggestAssigneeRequest request
    );

    AIBugAnalysisResponse analyzeBug(
        AnalyzeBugRequest request
    );

    AITextResponse generateSprintGoal(
        GenerateSprintGoalRequest request
    );

    AIEstimateResponse estimateStoryPoints(
        EstimateRequest request
    );

    AISubTasksResponse generateSubTasks(
        GenerateSubTasksRequest request
    );

    AITextResponse chat(
        AIChatRequest request
    );

    AITextResponse summarizeProject(
        SummarizeProjectRequest request
    );
}