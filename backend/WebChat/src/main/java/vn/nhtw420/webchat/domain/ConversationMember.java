package vn.nhtw420.webchat.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Getter
@Setter
@Document(collection = "conversation_members")
@CompoundIndex(name = "conversation_user_idx", def = "{'conversationId': 1, 'userId': 1}", unique = true)
public class ConversationMember {
    @Id
    private String id;

    private String conversationId;
    private String userId;

    private MemberRole role;
    private String lastReadMessageId;

    public ConversationMember() {
        this.id = UUID.randomUUID().toString();
    }
}
