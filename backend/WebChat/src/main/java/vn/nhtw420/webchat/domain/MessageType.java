package vn.nhtw420.webchat.domain;

public enum MessageType {
    TEXT,
    IMAGE,
    FILE;

    @Override
    public String toString() {
        return name();
    }

    public static MessageType fromString(String type) {
        return valueOf(type.toUpperCase());
    }
}
