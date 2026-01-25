package vn.nhtw420.webchat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import vn.nhtw420.webchat.domain.Conversation;

import java.util.List;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    @Query("{'members.userId': ?0}")
    List<Conversation> findByMembersUserId(String userId);
}
