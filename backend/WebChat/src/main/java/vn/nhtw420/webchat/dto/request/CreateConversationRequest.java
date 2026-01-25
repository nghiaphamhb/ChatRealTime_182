package vn.nhtw420.webchat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.nhtw420.webchat.domain.ConversationType;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {
    private ConversationType type;
    private String title;
    private List<String> memberUserIds;
}
