package com.projectmanagement.service.impl;

import com.projectmanagement.exception.custom.FileUploadException;
import com.projectmanagement.service.interfaces.IFileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageServiceImpl implements IFileStorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3-bucket}")
    private String bucket;

    @Value("${aws.region:eu-east-1}")
    private String region;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        String key = folder + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            log.info("Uploading file to S3 bucket: {} with key: {} in region: {}", bucket, key, region);
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes()));
            log.info("File uploaded successfully to S3");
            return key;
        } catch (IOException e) {
            log.error("IOException during file upload", e);
            throw new FileUploadException("Failed to upload file: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Exception during S3 upload to bucket {} with key {}", bucket, key, e);
            throw new FileUploadException("Failed to upload file to S3: " + e.getMessage(), e);
        }
    }

    @Override
    public String resolveFileUrl(String key) {
        if (key == null || key.isBlank()) {
            return null;
        }

        return presignUrl(key);

    }

    @Override
    public void deleteFile(String fileUrl) {
        String key = extractKey(fileUrl);
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
    }

    private String presignUrl(String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofHours(1))
                .getObjectRequest(getObjectRequest)
                .build();

        return s3Presigner.presignGetObject(presignRequest)
                .url()
                .toExternalForm();
    }

    private String extractKey(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) {
            throw new FileUploadException("Invalid file URL format: " + fileUrl, null);
        }

        String key = fileUrl;

        if (fileUrl.startsWith("http")) {
            int queryIndex = fileUrl.indexOf("?");
            if (queryIndex > 0) {
                key = fileUrl.substring(0, queryIndex);
            }
            if (key.contains(".amazonaws.com/")) {
                key = key.substring(key.indexOf(".amazonaws.com/") + ".amazonaws.com/".length());
            } else if (key.contains(bucket + "/")) {
                key = key.substring(key.indexOf(bucket + "/") + (bucket + "/").length());
            } else {
                throw new FileUploadException("Invalid S3 file URL format: " + fileUrl, null);
            }
        }

        return key;
    }
}
