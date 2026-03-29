package vn.nhtw420.webchat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import vn.nhtw420.webchat.domain.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    List<User> findByDisplayName(String displayName);
    List<User> findByDisplayNameContainingIgnoreCase (String displayName);
}
