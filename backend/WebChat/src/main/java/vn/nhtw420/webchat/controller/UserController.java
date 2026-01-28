package vn.nhtw420.webchat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import vn.nhtw420.webchat.annotation.CurrentUser;
import vn.nhtw420.webchat.dto.request.CreateUserRequest;
import vn.nhtw420.webchat.dto.request.UpdateUserRequest;
import vn.nhtw420.webchat.dto.response.UserDto;
import vn.nhtw420.webchat.security.UserPrincipal;
import vn.nhtw420.webchat.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getCurrentUser(principal.getUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable String id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<UserDto> uploadAvatar(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @CurrentUser UserPrincipal principal
    ) {
        validateUserAccess(id, principal);
        return ResponseEntity.ok(userService.uploadAvatar(id, file));
    }

    @DeleteMapping("/edit/{id}")
    public ResponseEntity<UserDto> deleteAvatar(
            @PathVariable String id,
            @CurrentUser UserPrincipal principal
    ) {
        validateUserAccess(id, principal);
        return ResponseEntity.ok(userService.deleteAvatar(id));
    }

    private void validateUserAccess(String requestedUserId, UserPrincipal principal) {
        if (!requestedUserId.equals(principal.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }
}
