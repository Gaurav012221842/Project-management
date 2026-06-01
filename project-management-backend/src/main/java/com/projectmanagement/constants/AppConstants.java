package com.projectmanagement.constants;

public final class AppConstants {

    private AppConstants() {}

    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";

    public static final long MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024L; // 10 MB
    public static final String[] ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"};
    public static final String[] ALLOWED_FILE_TYPES = {"application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"};

    public static final String UPLOADS_DIR = "uploads/";
}
