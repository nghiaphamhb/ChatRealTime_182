package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.nhtw420.webchat.domain.ConversationType;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationListItemResponse {
    private String id;
    private ConversationType type;
    private String title;
    private LastMessageInfo lastMessage;
    private Instant lastMessageAt;
    private int unreadCount;

    @Data
    public static class LastMessageInfo {
        private String id;
        private String content;
        private Instant createdAt;
    }
}
