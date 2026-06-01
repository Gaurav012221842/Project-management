package com.projectmanagement.constants;

public final class ApiRoutes {

    private ApiRoutes() {}

    public static final String BASE_API = "/api/v1";

    public static final String AUTH_BASE = BASE_API + "/auth";
    public static final String AUTH_REGISTER = AUTH_BASE + "/register";
    public static final String AUTH_LOGIN = AUTH_BASE + "/login";
    public static final String AUTH_REFRESH = AUTH_BASE + "/refresh";
    public static final String AUTH_FORGOT_PASSWORD = AUTH_BASE + "/forgot-password";
    public static final String AUTH_RESET_PASSWORD = AUTH_BASE + "/reset-password";

    public static final String USERS_BASE = BASE_API + "/users";
    public static final String USERS_ME = USERS_BASE + "/me";

    public static final String WORKSPACES_BASE = BASE_API + "/workspaces";
    public static final String PROJECTS_BASE = BASE_API + "/projects";
    public static final String SPRINTS_BASE = BASE_API + "/sprints";
    public static final String TASKS_BASE = BASE_API + "/tasks";
    public static final String COMMENTS_BASE = BASE_API + "/comments";
    public static final String NOTIFICATIONS_BASE = BASE_API + "/notifications";
    public static final String ANALYTICS_BASE = BASE_API + "/analytics";
    public static final String AI_BASE = BASE_API + "/ai";
    public static final String LABELS_BASE = BASE_API + "/labels";
    public static final String MESSAGES_BASE = BASE_API + "/messages";
    public static final String ATTACHMENTS_BASE = BASE_API + "/attachments";
}
