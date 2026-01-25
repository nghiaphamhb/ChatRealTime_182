package vn.nhtw420.webchat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import vn.nhtw420.webchat.dto.request.CreateConversationRequest;
import vn.nhtw420.webchat.dto.request.MarkReadRequest;
import vn.nhtw420.webchat.dto.response.ConversationDetailResponse;
import vn.nhtw420.webchat.dto.response.ConversationListItemResponse;
import vn.nhtw420.webchat.dto.response.CreateConversationResponse;
import vn.nhtw420.webchat.security.UserPrincipal;
import vn.nhtw420.webchat.service.ConversationService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<List<ConversationListItemResponse>> getConversations(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<ConversationListItemResponse> conversations =
                conversationService.getUserConversations(principal.getUserId());
        return ResponseEntity.ok(conversations);
    }

    @PostMapping
    public ResponseEntity<CreateConversationResponse> createConversation(
            @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        CreateConversationResponse response = conversationService.createConversation(request, principal.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationDetailResponse> getConversationDetail(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ConversationDetailResponse detail =
                conversationService.getConversationDetail(id, principal.getUserId());
        return ResponseEntity.ok(detail);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Map<String, Boolean>> markAsRead(
            @PathVariable String id,
            @RequestBody MarkReadRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        conversationService.markAsRead(id, principal.getUserId(), request.getLastReadMessageId());
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
