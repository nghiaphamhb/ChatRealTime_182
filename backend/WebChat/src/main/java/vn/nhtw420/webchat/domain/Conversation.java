package vn.nhtw420.webchat.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Document(collection = "conversations")
public class Conversations {

    @Id
    private String id;

    @Field("type")
    private ConversationType conversationType;

    private String title;

    private List<ConversationMember> members = new ArrayList<>();

    @Field("lastMessage")
    private LastMessagePreview lastMessagePreview;

    private Instant createdAt;

    private Instant lastMessageAt;

    private List<UserReadState> readStates = new ArrayList<>();

    public Conversations() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }
}
