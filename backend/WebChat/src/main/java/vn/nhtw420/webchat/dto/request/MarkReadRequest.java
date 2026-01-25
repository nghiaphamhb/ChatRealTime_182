package vn.nhtw420.webchat.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkReadRequest {
    private String lastReadMessageId;
}
