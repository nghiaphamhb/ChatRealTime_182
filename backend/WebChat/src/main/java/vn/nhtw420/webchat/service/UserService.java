package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import vn.nhtw420.webchat.domain.User;
import vn.nhtw420.webchat.dto.request.CreateUserRequest;
import vn.nhtw420.webchat.dto.request.UpdateUserRequest;
import vn.nhtw420.webchat.dto.response.UserDto;
import vn.nhtw420.webchat.repository.UserRepository;
import vn.nhtw420.webchat.validator.DisplayNameValidator;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileService fileService;
    private final DisplayNameValidator displayNameValidator;

    public List<UserDto> getAllUsers() {
        return toDtoList(userRepository.findAll());
    }

    public UserDto getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toDto(user);
    }

    public UserDto createUser(CreateUserRequest request) {
        // 1) validate unique username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // +) validate display name
        displayNameValidator.validate(request.getDisplayName());

        // 2) build entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setDisplayName(request.getDisplayName());
        user.setPassword(request.getPassword());
        user.setCreatedAt(Instant.now());

        User saved = userRepository.save(user);

        return toDto(saved);
    }

    public UserDto getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toDto(user);
    }

    public UserDto updateUser(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updated = userRepository.save(user);
        return toDto(updated);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public UserDto uploadAvatar(String userId, MultipartFile file) {
        return updateUserAvatar(userId, user -> {
            try {
                // Delete old avatar if exists
                if (user.getAvatarUrl() != null) {
                    fileService.deleteAvatar(user.getAvatarUrl());
                }
                // Upload new avatar
                String avatarUrl = fileService.uploadAvatar(userId, file);
                user.setAvatarUrl(avatarUrl);
            } catch (Exception ex) {
                throw new RuntimeException("Failed to upload avatar: " + ex.getMessage());
            }
        });
    }

    public UserDto deleteAvatar(String userId) {
        return updateUserAvatar(userId, user -> {
            if (user.getAvatarUrl() != null) {
                try {
                    fileService.deleteAvatar(user.getAvatarUrl());
                    user.setAvatarUrl(null);
                } catch (Exception ex) {
                    throw new RuntimeException("Failed to delete avatar: " + ex.getMessage());
                }
            }
        });
    }

    public List<UserDto> searchUsersByDisplayName(String displayName) {
        String sanitized = displayNameValidator.sanitize(displayName);

        if (!displayNameValidator.isValid(sanitized)) {
            return List.of();
        }

        return userRepository.findByDisplayNameContainingIgnoreCase(sanitized)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getLastSeenAt()
        );
    }

    private List<UserDto> toDtoList(List<User> users) {
        List<UserDto> result = new ArrayList<>(users.size());
        for (User user : users) {
            result.add(toDto(user));
        }
        return result;
    }

    private UserDto updateUserAvatar(String userId, java.util.function.Consumer<User> updateAction) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        updateAction.accept(user);

        User updated = userRepository.save(user);
        return toDto(updated);
    }
}
