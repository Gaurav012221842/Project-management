package com.projectmanagement.utils;

import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public class FileUtils {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/gif", "image/webp");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024L; // 10 MB

    private FileUtils() {}

    public static boolean isAllowedImageType(MultipartFile file) {
        return ALLOWED_IMAGE_TYPES.contains(file.getContentType());
    }

    public static boolean isWithinSizeLimit(MultipartFile file) {
        return file.getSize() <= MAX_FILE_SIZE;
    }

    public static String getExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
