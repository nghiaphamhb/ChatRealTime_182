package vn.nhtw420.webchat.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;
    private String password;
    private String displayName;
    private Instant lastSeenAt;
    private String avatarUrl;
    private Instant createdAt;

    public User() {
        this.id = UUID.randomUUID().toString();
    }
}
