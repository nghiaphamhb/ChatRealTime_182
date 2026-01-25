package vn.nhtw420.webchat.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String displayName;
    private String avatarUrl;
}
