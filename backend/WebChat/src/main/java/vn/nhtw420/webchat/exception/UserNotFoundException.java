package vn.nhtw420.webchat.exception;

import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {
    private final String userId;

    public UserNotFoundException(String userId) {
        super("User not found");
        this.userId = userId;
    }
}
