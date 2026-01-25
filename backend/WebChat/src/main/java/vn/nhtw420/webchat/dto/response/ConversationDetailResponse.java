package vn.nhtw420.webchat.dto.response;

import lombok.Data;
import vn.nhtw420.webchat.domain.ConversationType;
import vn.nhtw420.webchat.domain.MemberRole;
import java.time.Instant;
import java.util.List;

@Data
public class ConversationDetailResponse {
    private String id;
    private ConversationType type;
    private String title;
    private List<MemberInfo> members;
    private Instant lastMessageAt;

    @Data
    public static class MemberInfo {
        private String userId;
        private String username;
        private String displayName;
        private MemberRole role;}
}
