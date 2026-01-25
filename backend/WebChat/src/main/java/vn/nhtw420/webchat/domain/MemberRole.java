package vn.nhtw420.webchat.domain;

public enum MemberRole {
    ADMIN,
    MEMBER;

    @Override
    public String toString() {
        return name();
    }

    public static MemberRole fromString(String role) {
        return valueOf(role.toUpperCase());
    }
}
