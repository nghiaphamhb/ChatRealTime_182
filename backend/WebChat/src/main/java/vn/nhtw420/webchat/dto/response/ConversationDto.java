package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ConversationDto {
    private String id;
    private String type;
    private String title;
    private MessageDto lastMessage; // nested
    private Instant lastMessageAt;
    private int unreadCount;
}
