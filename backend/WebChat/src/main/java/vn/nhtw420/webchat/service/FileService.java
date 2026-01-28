package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.nhtw420.webchat.config.SupabaseConfig;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageService {

    private final SupabaseConfig supabaseConfig;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String uploadAvatar(String userId, MultipartFile file) throws IOException, InterruptedException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File must be be less than 5MB");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = String.format("%s/%s.%s", userId, UUID.randomUUID(), extension);

        String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                supabaseConfig.getUrl(),
                supabaseConfig.getStorage().getBucket(), fileName);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer" + supabaseConfig.getKey())
                .header("Content-Type", contentType)
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200 && response.statusCode() != 201) {
            log.error("Failed to upload file: {}", response.body());
            throw new RuntimeException("Failed to upload file to storage");
        }

        return String.format("%s/storage/v1/object/public/%s/%s",
                supabaseConfig.getUrl(),
                supabaseConfig.getStorage().getBucket(),
                fileName);
    }

    public void deleteAvatar(String avatarUrl) throws IOException, InterruptedException {
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            return;
        }

        // Extract file path from URL
        String filePath = extractFilePathFromUrl(avatarUrl);
        if (filePath == null) {
            return;
        }

        String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
                supabaseConfig.getUrl(),
                supabaseConfig.getStorage().getBucket(),
                filePath);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(deleteUrl))
                .header("Authorization", "Bearer " + supabaseConfig.getKey())
                .DELETE()
                .build();

        httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private String extractFilePathFromUrl(String url) {
        if (url == null || !url.contains("/public/")) {
            return null;
        }

        String[] parts = url.split("/public/");
        if (parts.length < 2) {
            return null;
        }

        return parts[1].substring(parts[1].indexOf("/") + 1);
    }
}
