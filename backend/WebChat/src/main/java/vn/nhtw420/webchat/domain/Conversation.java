package vn.nhtw420.webchat.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "conversations")
public class Conversation {

    @Id
    private String id;

    private ConversationType type;
    private String title;

    private String lastMessageId;
    private Instant lastMessageAt;
    private int unreadCount;

    private Instant createdAt;

    public Conversation() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }
}
