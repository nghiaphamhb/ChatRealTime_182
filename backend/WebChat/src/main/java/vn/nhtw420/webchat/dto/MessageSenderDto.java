package vn.nhtw420.webchat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageSenderDto {
    private String id;
    private String username;
    private String displayName;
}
