package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import vn.nhtw420.webchat.config.SupabaseConfig;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final SupabaseConfig supabaseConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final String[] ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png"};

    public String uploadAvatar(String userId, MultipartFile file) {
        validateFile(file);

        String fileName = generateFileName(userId, file.getOriginalFilename());
        String uploadUrl = buildUploadUrl(fileName);

        HttpHeaders headers = createServiceRoleHeaders(file.getContentType());

        try {
            HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    uploadUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return buildPublicUrl(fileName);
            }

            throw new RuntimeException("Upload failed with status: " + response.getStatusCode());

        } catch (HttpClientErrorException ex) {
            throw new RuntimeException("Supabase error: " + ex.getResponseBodyAsString());
        } catch (Exception ex) {
            throw new RuntimeException("Failed to upload file: " + ex.getMessage());
        }
    }

    public void deleteAvatar(String avatarUrl) {
        String fileName = extractFileNameFromUrl(avatarUrl);
        String deleteUrl = buildDeleteUrl(fileName);

        HttpHeaders headers = createServiceRoleHeaders(null);
        HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

        try {
            restTemplate.exchange(
                    deleteUrl,
                    HttpMethod.DELETE,
                    requestEntity,
                    String.class
            );
        } catch (HttpClientErrorException ex) {
            // Ignore 404 if file already deleted
            if (ex.getStatusCode() != HttpStatus.NOT_FOUND) {
                throw new RuntimeException("Failed to delete file: " + ex.getMessage());
            }
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete file: " + ex.getMessage());
        }
    }

    private HttpHeaders createServiceRoleHeaders(String contentType) {
        HttpHeaders headers = new HttpHeaders();
        // Service Role Key - bypass RLS
        headers.set("Authorization", "Bearer " + supabaseConfig.getKey());
        headers.set("apikey", supabaseConfig.getKey());

        if (contentType != null) {
            headers.setContentType(MediaType.parseMediaType(contentType));
        }
        return headers;
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !isAllowedType(contentType)) {
            throw new RuntimeException("Only JPEG and PNG images are allowed");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds 5MB limit");
        }
    }

    private boolean isAllowedType(String contentType) {
        for (String allowedType : ALLOWED_TYPES) {
            if (allowedType.equalsIgnoreCase(contentType)) {
                return true;
            }
        }
        return false;
    }

    private String generateFileName(String userId, String originalFilename) {
        String extension = getFileExtension(originalFilename);
        return userId + "/" + UUID.randomUUID() + extension;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }

    private String buildUploadUrl(String fileName) {
        return supabaseConfig.getUrl() + "/storage/v1/object/"
                + supabaseConfig.getBucketName() + "/" + fileName;
    }

    private String buildDeleteUrl(String fileName) {
        return supabaseConfig.getUrl() + "/storage/v1/object/"
                + supabaseConfig.getBucketName() + "/" + fileName;
    }

    private String buildPublicUrl(String fileName) {
        return supabaseConfig.getUrl() + "/storage/v1/object/public/"
                + supabaseConfig.getBucketName() + "/" + fileName;
    }

    private String extractFileNameFromUrl(String url) {
        String prefix = "/storage/v1/object/public/" + supabaseConfig.getBucketName() + "/";
        int index = url.indexOf(prefix);

        if (index != -1) {
            return url.substring(index + prefix.length());
        }

        throw new RuntimeException("Invalid avatar URL format");
    }
}
