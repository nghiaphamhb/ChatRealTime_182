package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.nhtw420.webchat.domain.*;
import vn.nhtw420.webchat.dto.request.CreateConversationRequest;
import vn.nhtw420.webchat.dto.response.ConversationDetailResponse;
import vn.nhtw420.webchat.dto.response.ConversationListItemResponse;
import vn.nhtw420.webchat.dto.response.CreateConversationResponse;
import vn.nhtw420.webchat.repository.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository memberRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public CreateConversationResponse createConversation(CreateConversationRequest request, String currentUserId) {
        validateRequest(request);

        // Collect member IDs
        List<String> memberIds = buildMemberIdList(request, currentUserId);

        // Validate member count for DM
        validateDMMembers(request.getType(), memberIds);

        // Check if DM already exists
        if (request.getType() == ConversationType.DM) {
            Optional<Conversation> existingDM = findExistingDM(memberIds);
            if (existingDM.isPresent()) {
                return mapToResponse(existingDM.get(), currentUserId);
            }
        }

        // Create new conversation
        Conversation conversation = createNewConversation(request);
        conversationRepository.save(conversation);

        // Create member records
        createMemberRecords(conversation.getId(), memberIds, currentUserId);

        return mapToResponse(conversation, currentUserId);
    }


    public List<ConversationListItemResponse> getUserConversations(String userId) {
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
                .sorted(Comparator.comparing(
                        ConversationListItemResponse::getLastMessageAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
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
        Map<String, User> userMap = getUserMap(members);

        return buildDetailResponse(conversation, members, userMap, userId);
    }

    public void markAsRead(String conversationId, String userId, String lastReadMessageId) {
        ConversationMember member = memberRepository.findByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new IllegalStateException("Not a member"));

        member.setLastReadMessageId(lastReadMessageId);
        memberRepository.save(member);
    }

    private void validateRequest(CreateConversationRequest request) {
        if (request.getType() == null) {
            throw new IllegalArgumentException("Conversation type is required");
        }

        if (request.getType() == ConversationType.GROUP &&
                (request.getTitle() == null || request.getTitle().isBlank())) {
            throw new IllegalArgumentException("Title is required for GROUP conversations");
        }
    }

    private List<String> buildMemberIdList(CreateConversationRequest request, String currentUserId) {
        List<String> memberIds = new ArrayList<>();
        memberIds.add(currentUserId);

        if (request.getMemberIds() != null && !request.getMemberIds().isEmpty()) {
            for (String memberId : request.getMemberIds()) {
                if (!userRepository.existsById(memberId)) {
                    throw new IllegalArgumentException("User not found: " + memberId);
                }

                if (!memberIds.contains(memberId)) {
                    memberIds.add(memberId);
                }
            }
        }

        return memberIds;
    }

    private void validateDMMembers(ConversationType type, List<String> memberIds) {
        if (type == ConversationType.DM && memberIds.size() != 2) {
            throw new IllegalArgumentException("DM conversation must have exactly 2 members");
        }
    }

    private Optional<Conversation> findExistingDM(List<String> memberIds) {
        List<String> sortedIds = memberIds.stream()
                .sorted()
                .collect(Collectors.toList());

        return conversationRepository.findDMByMembers(ConversationType.DM, sortedIds);
    }

    private Conversation createNewConversation(CreateConversationRequest request) {
        Conversation conversation = new Conversation();
        conversation.setType(request.getType());
        conversation.setCreatedAt(Instant.now());
        conversation.setLastMessageAt(Instant.now());

        if (request.getType() == ConversationType.GROUP) {
            conversation.setTitle(request.getTitle());
        }

        return conversation;
    }

    private void createMemberRecords(String conversationId, List<String> memberIds, String creatorId) {
        for (String memberId : memberIds) {
            ConversationMember member = new ConversationMember();
            member.setConversationId(conversationId);
            member.setUserId(memberId);
            member.setRole(memberId.equals(creatorId) ? MemberRole.ADMIN : MemberRole.MEMBER);
            member.setJoinedAt(Instant.now());
            memberRepository.save(member);
        }
    }

    private Map<String, User> getUserMap(List<ConversationMember> members) {
        List<String> userIds = members.stream()
                .map(ConversationMember::getUserId)
                .toList();

        return userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));
    }

    private ConversationDetailResponse buildDetailResponse(
            Conversation conversation,
            List<ConversationMember> members,
            Map<String, User> userMap,
            String currentUserId
    ) {
        ConversationDetailResponse response = new ConversationDetailResponse();
        response.setId(conversation.getId());
        response.setType(conversation.getType());
        response.setTitle(getConversationTitle(conversation, currentUserId, userMap));
        response.setMembers(members.stream()
                .map(m -> buildMemberInfo(m, userMap.get(m.getUserId())))
                .toList());
        response.setLastMessageAt(conversation.getLastMessageAt());

        return response;
    }

    private ConversationDetailResponse.MemberInfo buildMemberInfo(ConversationMember member, User user) {
        ConversationDetailResponse.MemberInfo info = new ConversationDetailResponse.MemberInfo();
        info.setUserId(user.getId());
        info.setUsername(user.getUsername());
        info.setDisplayName(user.getDisplayName());
        info.setRole(member.getRole());
        return info;
    }

    private ConversationListItemResponse buildListItem(Conversation conv, String currentUserId) {
        ConversationListItemResponse item = new ConversationListItemResponse();
        item.setId(conv.getId());
        item.setType(conv.getType());

        List<ConversationMember> members = memberRepository.findByConversationId(conv.getId());
        Map<String, User> userMap = getUserMap(members);

        item.setTitle(getConversationTitle(conv, currentUserId, userMap));
        item.setLastMessageAt(conv.getLastMessageAt());

        setLastMessageInfo(item, conv);
        setUnreadCount(item, conv, currentUserId, members);

        return item;
    }

    private void setLastMessageInfo(ConversationListItemResponse item, Conversation conv) {
        if (conv.getLastMessageId() != null) {
            messageRepository.findById(conv.getLastMessageId()).ifPresent(msg -> {
                ConversationListItemResponse.LastMessageInfo info = new ConversationListItemResponse.LastMessageInfo();
                info.setId(msg.getId());
                info.setContent(msg.getContent());
                info.setCreatedAt(msg.getCreatedAt());
                item.setLastMessage(info);
            });
        }
    }

    private void setUnreadCount(ConversationListItemResponse item, Conversation conv, String currentUserId, List<ConversationMember> members) {
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
    }

    private String getConversationTitle(Conversation conv, String currentUserId, Map<String, User> userMap) {
        if (conv.getType() == ConversationType.GROUP) {
            return conv.getTitle();
        }

        return userMap.values().stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(User::getDisplayName)
                .findFirst()
                .orElse("Unknown");
    }

    private CreateConversationResponse mapToResponse(Conversation conversation, String currentUserId) {
        CreateConversationResponse response = new CreateConversationResponse();
        response.setId(conversation.getId());
        response.setType(conversation.getType());
        response.setCreatedAt(conversation.getCreatedAt());

        if (conversation.getType() == ConversationType.GROUP) {
            response.setTitle(conversation.getTitle());
        } else {
            List<ConversationMember> members = memberRepository.findByConversationId(conversation.getId());
            Map<String, User> userMap = getUserMap(members);

            String otherUserDisplayName = userMap.values().stream()
                    .filter(u -> !u.getId().equals(currentUserId))
                    .map(User::getDisplayName)
                    .findFirst()
                    .orElse("Unknown");

            response.setTitle(otherUserDisplayName);
        }

        return response;
    }
}