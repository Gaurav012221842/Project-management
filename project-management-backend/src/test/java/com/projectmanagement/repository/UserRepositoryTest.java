package com.projectmanagement.repository;

import com.projectmanagement.entity.User;
import com.projectmanagement.enums.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_ShouldReturnUser_WhenExists() {
        User user = User.builder()
                .email("test@example.com")
                .name("Test User")
                .password("encodedPassword")
                .role(Role.DEVELOPER)
                .build();
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");

        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenExists() {
        User user = User.builder()
                .email("exists@example.com")
                .name("Exists User")
                .password("encoded")
                .role(Role.DEVELOPER)
                .build();
        userRepository.save(user);

        assertThat(userRepository.existsByEmail("exists@example.com")).isTrue();
        assertThat(userRepository.existsByEmail("notexists@example.com")).isFalse();
    }
}
