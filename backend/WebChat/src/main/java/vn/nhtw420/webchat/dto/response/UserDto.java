package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private Instant lastSeenAt;
}
