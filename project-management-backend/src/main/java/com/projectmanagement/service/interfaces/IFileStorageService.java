package com.projectmanagement.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface IFileStorageService {
    String uploadFile(MultipartFile file, String folder);
    String resolveFileUrl(String fileUrl);
    void deleteFile(String fileUrl);
}
