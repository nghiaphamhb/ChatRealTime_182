package vn.nhtw420.webchat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.nhtw420.webchat.domain.ConversationType;
import vn.nhtw420.webchat.dto.ConversationMemberDto;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDetailDto {
    private String id;
    private ConversationType type;
    private String title;
    private List<ConversationMemberDto> members;
    private Instant lastMessageAt;
}
