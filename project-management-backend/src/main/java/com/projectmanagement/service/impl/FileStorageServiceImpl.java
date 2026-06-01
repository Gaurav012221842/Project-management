package com.projectmanagement.service.impl;

import com.projectmanagement.exception.custom.FileUploadException;
import com.projectmanagement.service.interfaces.IFileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements IFileStorageService {

    private final S3Client s3Client;

    @Value("${aws.s3-bucket}")
    private String bucket;

    @Value("${aws.region:us-east-1}")
    private String region;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        String key = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            s3Client.putObject(
                    PutObjectRequest.builder().bucket(bucket).key(key).contentType(file.getContentType()).build(),
                    RequestBody.fromBytes(file.getBytes()));
            return "https://" + bucket + ".s3." + region + ".amazonaws.com/" + key;
        } catch (IOException e) {
            throw new FileUploadException("Failed to upload file", e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        String key = fileUrl.substring(fileUrl.indexOf(".amazonaws.com/") + 15);
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    }
}
