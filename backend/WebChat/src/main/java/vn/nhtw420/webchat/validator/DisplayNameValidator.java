package vn.nhtw420.webchat.validator;

import org.springframework.stereotype.Component;

@Component
public class DisplayNameValidator {

    private static final int MIN_LENGTH = 2;
    private static final int MAX_LENGTH = 50;
    private static final String VALID_PATTERN = "^[\\p{L}\\p{N}\\s\\-_'.!@]+$";

    public void validate(String displayName) {
        if (displayName == null) {
            throw new IllegalArgumentException("Display name cannot be null");
        }

        String trimmed = displayName.trim();

        if (trimmed.length() < MIN_LENGTH || trimmed.length() > MAX_LENGTH) {
            throw new IllegalArgumentException(
                    String.format("Display name must be %d-%d characters", MIN_LENGTH, MAX_LENGTH)
            );
        }

        if (!trimmed.matches(VALID_PATTERN)) {
            throw new IllegalArgumentException("Display name contains invalid characters");
        }
    }

    public String sanitize(String displayName) {
        return displayName != null ? displayName.trim() : null;
    }

    public boolean isValid(String displayName) {
        if (displayName == null) {
            return false;
        }

        String trimmed = displayName.trim();
        return trimmed.length() >= MIN_LENGTH &&
                trimmed.length() <= MAX_LENGTH &&
                trimmed.matches(VALID_PATTERN);
    }
}