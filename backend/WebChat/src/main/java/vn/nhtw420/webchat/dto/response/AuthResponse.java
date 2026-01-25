package vn.nhtw420.webchat.dto.response;

import lombok.Data;
import java.util.Map;

@Data
public class AuthResponse {
    private String token;
    private Map<String, Object> user;
}