package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.nhtw420.webchat.dto.MessageSenderDto;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private String id;
    private String conversationId;
    private MessageSenderDto sender;
    private String type;
    private String content;
    private Instant createdAt;
}
