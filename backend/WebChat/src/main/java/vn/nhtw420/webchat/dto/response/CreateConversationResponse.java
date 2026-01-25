package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.nhtw420.webchat.domain.ConversationType;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateConversationResponse {
    private String id;
    private ConversationType type;
    private String title;
    private Instant createdAt;
}
