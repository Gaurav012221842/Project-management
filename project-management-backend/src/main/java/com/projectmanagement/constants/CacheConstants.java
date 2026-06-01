package com.projectmanagement.constants;

public final class CacheConstants {

    private CacheConstants() {}

    public static final String USERS_CACHE = "users";
    public static final String WORKSPACES_CACHE = "workspaces";
    public static final String PROJECTS_CACHE = "projects";
    public static final String SPRINTS_CACHE = "sprints";
    public static final String TASKS_CACHE = "tasks";
    public static final String ANALYTICS_CACHE = "analytics";

    public static final long DEFAULT_TTL_SECONDS = 3600;
    public static final long SHORT_TTL_SECONDS = 300;
    public static final long LONG_TTL_SECONDS = 86400;
}
