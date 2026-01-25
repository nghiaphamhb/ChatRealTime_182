package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.nhtw420.webchat.dto.MessageSenderDto;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Conversation {
    private String id;
    private String type;
    private String title;
    private MessageSenderDto lastMessage; // nested
    private Instant lastMessageAt;
    private int unreadCount;
}
