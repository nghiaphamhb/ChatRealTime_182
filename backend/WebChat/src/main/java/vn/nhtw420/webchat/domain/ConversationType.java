package vn.nhtw420.webchat.domain;

public enum ConversationType {
    DM,
    GROUP;

    @Override
    public String toString() {
        return name();
    }

    public static ConversationType fromString(String type) {
        return valueOf(type.toUpperCase());
    }
}
