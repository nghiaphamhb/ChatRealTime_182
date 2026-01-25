package vn.nhtw420.webchat.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import vn.nhtw420.webchat.domain.Message;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByConversationIdOrderByCreatedAtDesc(String ConversationId, Pageable pageable);

    List<Message> findByConversationIdAndIdLessThanOrderByCreatedAtDesc(String ConversationId, String beforeId, Pageable pageable);

    Optional<Message> findByClientMsgId(String message);

    long countByConversationIdAndIdGreaterThan(String conversationId, String messageId);
}
