package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import vn.nhtw420.webchat.domain.User;
import vn.nhtw420.webchat.dto.request.CreateUserRequest;
import vn.nhtw420.webchat.dto.request.LoginRequest;
import vn.nhtw420.webchat.dto.response.AuthResponse;
import vn.nhtw420.webchat.repository.UserRepository;
import vn.nhtw420.webchat.utils.JwtUtils;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        user.setLastSeenAt(Instant.now());
        userRepository.save(user);

        String token = jwtUtils.generateJwtToken(user.getId(), user.getUsername());
        logger.info("[Auth] User logged in: {}", user.getUsername());

        return buildAuthResponse(token, user);
    }

    public AuthResponse register(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName());
        user.setAvatarUrl(null);
        user.setCreatedAt(Instant.now());
        user.setLastSeenAt(Instant.now());

        User savedUser = userRepository.save(user);

        String token = jwtUtils.generateJwtToken(savedUser.getId(), savedUser.getUsername());
        logger.info("[Auth] New user registered: {}", savedUser.getUsername());

        return buildAuthResponse(token, savedUser);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("username", user.getUsername());
        userMap.put("displayName", user.getDisplayName());
        userMap.put("avatarUrl", user.getAvatarUrl());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(userMap);

        return response;
    }
}
