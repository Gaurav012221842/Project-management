package com.projectmanagement.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface IFileStorageService {
    String uploadFile(MultipartFile file, String folder);
    void deleteFile(String fileUrl);
}
