package vn.nhtw420.webchat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import vn.nhtw420.webchat.domain.Message;
import vn.nhtw420.webchat.domain.MessageType;
import vn.nhtw420.webchat.domain.User;
import vn.nhtw420.webchat.dto.MessageSenderDto;
import vn.nhtw420.webchat.dto.request.CreateMessageRequest;
import vn.nhtw420.webchat.dto.response.MessageDto;
import vn.nhtw420.webchat.dto.response.MessagePageResponse;
import vn.nhtw420.webchat.repository.MessageRepository;
import vn.nhtw420.webchat.repository.UserRepository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessagePageResponse getMessages(String conversationId, String before, int limit) {
        // Load limit+1 items to determine hasMore without running an extra query.
        List<Message> messages;

        if (before == null || before.isBlank()) {
            messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(
                    conversationId, PageRequest.of(0, limit + 1));
        } else {
            messages = messageRepository.findByConversationIdAndIdLessThanOrderByCreatedAtDesc(
                    conversationId, before, PageRequest.of(0, limit + 1));
        }

        boolean hasMore = messages.size() > limit;

        // Keep only 'limit' items for this page.
        int take = Math.min(messages.size(), limit);
        List<Message> pageMessages = messages.subList(0, take);

        // Avoid N+1 problem: load all senders in ONE query.
        Map<String, User> sendersById = loadSenders(pageMessages);

        // Map messages to DTOs using simple loops for readability/debugging.
        List<MessageDto> items = new ArrayList<>(pageMessages.size());
        for (Message msg : pageMessages) {
            items.add(toDto(msg, sendersById));
        }

        String nextBefore = (hasMore && !items.isEmpty())
                ? items.get(items.size() - 1).getId()
                : null;

        return new MessagePageResponse(
                items,
                new MessagePageResponse.PageInfo(hasMore, nextBefore)
        );
    }

    public MessageDto createMessage(String conversationId, String senderId, CreateMessageRequest request) {
        // Check duplicate by clientMsgId
        if (request.getClientMsgId() != null && !request.getClientMsgId().isBlank()) {
            Optional<Message> existing = messageRepository.findByClientMsgId(request.getClientMsgId());
            if (existing.isPresent()) {
                Map<String, User> sendersById = loadSenders(List.of(existing.get()));
                return toDto(existing.get(), sendersById);
            }
        }

        // Create new message
        MessageType type;
        try {
            type = MessageType.fromString(request.getType());
        } catch (Exception e) {
            throw new RuntimeException("Invalid message type: " + request.getType());
        }

        Message message = new Message();
        message.setConversationId(conversationId);
        message.setSenderId(senderId);
        message.setType(type);
        message.setContent(request.getContent());
        message.setClientMsgId(request.getClientMsgId());
        message.setCreatedAt(Instant.now());

        Message saved = messageRepository.save(message);
        Map<String, User> sendersById = loadSenders(List.of(saved));

        return toDto(saved, sendersById);
    }

    public void deleteMessage(String conversationId, String messageId) {
        Optional<Message> message = messageRepository.findById(messageId);
        if (message.isEmpty()) {
            throw new RuntimeException("Message not found");
        }
        if (!message.get().getConversationId().equals(conversationId)) {
            throw new RuntimeException("Message does not belong to conversation");
        }
        messageRepository.deleteById(messageId);
    }

    private Map<String, User> loadSenders(List<Message> messages) {
        Set<String> senderIds = new HashSet<>();
        for (Message m : messages) {
            if (m.getSenderId() != null) {
                senderIds.add(m.getSenderId());
            }
        }

        Map<String, User> sendersById = new HashMap<>();
        if (senderIds.isEmpty()) return sendersById;

        List<User> users = userRepository.findAllById(senderIds);
        for (User u : users) {
            sendersById.put(u.getId(), u);
        }

        return sendersById;
    }

    public MessageDto updateMessage(String conversationId, String messageId, String newContent) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getConversationId().equals(conversationId)) {
            throw new RuntimeException("Message does not belong to conversation");
        }

        message.setContent(newContent);

        Message updated = messageRepository.save(message);
        Map<String, User> sendersById = loadSenders(List.of(updated));

        return toDto(updated, sendersById);
    }

    public MessageDto toDto(Message message, Map<String, User> sendersById) {
        User sender = sendersById.get(message.getSenderId());
        if (sender == null) {
            // This usually indicates data inconsistency: message.senderId references missing user.
            throw new RuntimeException("Sender not found: " + message.getSenderId());
        }

        return new MessageDto(
                message.getId(),
                message.getConversationId(),
                new MessageSenderDto(
                        sender.getId(),
                        sender.getUsername(),
                        sender.getDisplayName()
                ),
                message.getType().toString(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
