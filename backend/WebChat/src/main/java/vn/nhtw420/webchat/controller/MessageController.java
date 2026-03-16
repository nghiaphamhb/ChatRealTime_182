package vn.nhtw420.webchat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.nhtw420.webchat.dto.request.CreateMessageRequest;
import vn.nhtw420.webchat.dto.request.UpdateMessageRequest;
import vn.nhtw420.webchat.dto.response.CreateMessageResponse;
import vn.nhtw420.webchat.dto.response.MessageDto;
import vn.nhtw420.webchat.dto.response.MessagePageResponse;
import vn.nhtw420.webchat.security.UserPrincipal;
import vn.nhtw420.webchat.service.MessageService;

@RestController
@RequestMapping("/api/conversations/{conversationId}/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<MessagePageResponse> getMessages(
            @PathVariable String conversationId,
            @RequestParam(required = false) String before,
            @RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(messageService.getMessages(conversationId, before, limit));
    }

    @PostMapping
    public ResponseEntity<CreateMessageResponse> createMessage(
            @PathVariable String conversationId,
            @RequestBody CreateMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        MessageDto message = messageService.createMessage(conversationId, principal.getUserId(), request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CreateMessageResponse(message));
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<MessageDto> updateMessage(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @RequestBody UpdateMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(
                messageService.updateMessage(conversationId, messageId, request.getContent())
        );
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable String conversationId,
            @PathVariable String messageId,
            @AuthenticationPrincipal UserPrincipal principal) {
        messageService.deleteMessage(conversationId, messageId);
        return ResponseEntity.noContent().build();
    }
}
