package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.nhtw420.webchat.domain.*;
import vn.nhtw420.webchat.dto.request.CreateConversationRequest;
import vn.nhtw420.webchat.dto.response.ConversationDetailResponse;
import vn.nhtw420.webchat.dto.response.ConversationListItemResponse;
import vn.nhtw420.webchat.dto.response.CreateConversationResponse;
import vn.nhtw420.webchat.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository memberRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Transactional
    public CreateConversationResponse createConversation(CreateConversationRequest request, String currentUserId) {
        // Validate memberUserIds
        List<String> allMemberIds = new ArrayList<>(request.getMemberUserIds());
        if (!allMemberIds.contains(currentUserId)) {
            allMemberIds.add(currentUserId);
        }

        if (request.getType() == ConversationType.DM && allMemberIds.size() != 2) {
            throw new IllegalArgumentException("DM conversation must have exactly 2 members");
        }

        // Check if DM already exists
        if (request.getType() == ConversationType.DM) {
            Optional<Conversation> existing = findExistingDM(allMemberIds.get(0), allMemberIds.get(1));
            if (existing.isPresent()) {
                return mapToResponse(existing.get());
            }
        }

        // Create conversation
        Conversation conversation = new Conversation();
        conversation.setType(request.getType());
        conversation.setTitle(request.getTitle());
        conversationRepository.save(conversation);

        // Create members
        for (int i = 0; i < allMemberIds.size(); i++) {
            ConversationMember member = new ConversationMember();
            member.setConversationId(conversation.getId());
            member.setUserId(allMemberIds.get(i));
            member.setRole(i == 0 && allMemberIds.get(i).equals(currentUserId)
                    ? MemberRole.ADMIN
                    : MemberRole.MEMBER);
            memberRepository.save(member);
        }

        return mapToResponse(conversation);
    }

    public List<ConversationListItemResponse> getUserConversations(String userId) {
        // Get all conversations user is member of
        List<ConversationMember> memberships = memberRepository.findByUserId(userId);
        List<String> conversationIds = memberships.stream()
                .map(ConversationMember::getConversationId)
                .toList();

        if (conversationIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Conversation> conversations = conversationRepository.findAllById(conversationIds);

        return conversations.stream()
                .map(conv -> buildListItem(conv, userId))
                .sorted((a, b) -> {
                    if (a.getLastMessageAt() == null && b.getLastMessageAt() == null) return 0;
                    if (a.getLastMessageAt() == null) return 1;
                    if (b.getLastMessageAt() == null) return -1;
                    return b.getLastMessageAt().compareTo(a.getLastMessageAt());
                })
                .toList();
    }

    public ConversationDetailResponse getConversationDetail(String conversationId, String userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        // Check membership
        memberRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new IllegalStateException("Not a member of this conversation"));

        // Get all members
        List<ConversationMember> members = memberRepository.findByConversationId(conversationId);
        Map<String, User> userMap = userRepository.findAllById(
                members.stream().map(ConversationMember::getUserId).toList()
        ).stream().collect(Collectors.toMap(User::getId, u -> u));

        ConversationDetailResponse response = new ConversationDetailResponse();
        response.setId(conversation.getId());
        response.setType(conversation.getType());
        response.setTitle(getConversationTitle(conversation, userId, userMap));
        response.setMembers(members.stream()
                .map(m -> {
                    User user = userMap.get(m.getUserId());
                    ConversationDetailResponse.MemberInfo info = new ConversationDetailResponse.MemberInfo();
                    info.setUserId(user.getId());
                    info.setUsername(user.getUsername());
                    info.setDisplayName(user.getDisplayName());
                    info.setRole(m.getRole());
                    return info;
                })
                .toList());
        response.setLastMessageAt(conversation.getLastMessageAt());

        return response;
    }

    public void markAsRead(String conversationId, String userId, String lastReadMessageId) {
        ConversationMember member = memberRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new IllegalStateException("Not a member"));

        member.setLastReadMessageId(lastReadMessageId);
        memberRepository.save(member);
    }

    // Helper methods
    private Optional<Conversation> findExistingDM(String userId1, String userId2) {
        List<ConversationMember> user1Convs = memberRepository.findByUserId(userId1);
        List<ConversationMember> user2Convs = memberRepository.findByUserId(userId2);

        Set<String> user2ConvIds = user2Convs.stream()
                .map(ConversationMember::getConversationId)
                .collect(Collectors.toSet());

        for (ConversationMember m : user1Convs) {
            if (user2ConvIds.contains(m.getConversationId())) {
                Conversation conv = conversationRepository.findById(m.getConversationId()).orElse(null);
                if (conv != null && conv.getType() == ConversationType.DM) {
                    return Optional.of(conv);
                }
            }
        }
        return Optional.empty();
    }

    private ConversationListItemResponse buildListItem(Conversation conv, String currentUserId) {
        ConversationListItemResponse item = new ConversationListItemResponse();
        item.setId(conv.getId());
        item.setType(conv.getType());

        // Get members for title
        List<ConversationMember> members = memberRepository.findByConversationId(conv.getId());
        Map<String, User> userMap = userRepository.findAllById(
                members.stream().map(ConversationMember::getUserId).toList()
        ).stream().collect(Collectors.toMap(User::getId, u -> u));

        item.setTitle(getConversationTitle(conv, currentUserId, userMap));

        // Last message
        if (conv.getLastMessageId() != null) {
            messageRepository.findById(conv.getLastMessageId()).ifPresent(msg -> {
                ConversationListItemResponse.LastMessageInfo info = new ConversationListItemResponse.LastMessageInfo();
                info.setId(msg.getId());
                info.setContent(msg.getContent());
                info.setCreatedAt(msg.getCreatedAt());
                item.setLastMessage(info);
            });
        }

        item.setLastMessageAt(conv.getLastMessageAt());

        // Unread count
        ConversationMember currentMember = members.stream()
                .filter(m -> m.getUserId().equals(currentUserId))
                .findFirst()
                .orElse(null);

        if (currentMember != null && currentMember.getLastReadMessageId() != null) {
            long unreadCount = messageRepository.countByConversationIdAndIdGreaterThan(
                    conv.getId(),
                    currentMember.getLastReadMessageId()
            );
            item.setUnreadCount((int) unreadCount);
        }

        return item;
    }

    private String getConversationTitle(Conversation conv, String currentUserId, Map<String, User> userMap) {
        if (conv.getType() == ConversationType.GROUP) {
            return conv.getTitle();
        }

        // DM: show other user's display name
        return userMap.values().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(User::getDisplayName)
                .findFirst()
                .orElse("Unknown");
    }

    private CreateConversationResponse mapToResponse(Conversation conversation) {
        CreateConversationResponse response = new CreateConversationResponse();
        response.setId(conversation.getId());
        response.setType(conversation.getType());
        response.setTitle(conversation.getTitle());
        response.setCreatedAt(conversation.getCreatedAt());

        return response;
    }
}