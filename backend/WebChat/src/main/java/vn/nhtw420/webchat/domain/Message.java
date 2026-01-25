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
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @Indexed
    private String conversationId;
    private String senderId;
    private MessageType type;
    private String content;
    private String clientMsgId;
    private Instant createdAt;

    public Message() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }
}
