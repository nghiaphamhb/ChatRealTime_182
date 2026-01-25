package vn.nhtw420.webchat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import vn.nhtw420.webchat.domain.ConversationMember;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationMemberRepository extends MongoRepository<ConversationMember, String> {
    List<ConversationMember> findByConversationId(String conversationId);
    List<ConversationMember> findByUserId(String userId);
    Optional<ConversationMember> findByConversationIdAndUserId(String conversationId, String userId);
    void deleteByConversationIdAndUserId(String conversationId, String userId);
}
