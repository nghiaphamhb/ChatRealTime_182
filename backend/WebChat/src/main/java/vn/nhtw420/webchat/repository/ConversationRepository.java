package vn.nhtw420.webchat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import vn.nhtw420.webchat.domain.Conversation;
import vn.nhtw420.webchat.domain.ConversationType;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends MongoRepository<Conversation, String> {
    @Query("{'type': ?0, 'members': {$all: ?1, $size: 2}}")
    Optional<Conversation> findDMByMembers(ConversationType type, List<String> memberIds);
}
