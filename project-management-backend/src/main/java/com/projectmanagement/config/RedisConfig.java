// RedisConfig.java
package com.projectmanagement.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@Slf4j
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    @Value("${spring.data.redis.username:default}")
    private String redisUsername;

    @Value("${spring.data.redis.ssl.enabled:true}")
    private boolean redisSslEnabled;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration(redisHost, redisPort);
        if (redisUsername != null && !redisUsername.isBlank()) {
            config.setUsername(redisUsername);
        }
        if (redisPassword != null && !redisPassword.isBlank()) {
            config.setPassword(redisPassword);
        }

        LettuceClientConfiguration.LettuceClientConfigurationBuilder clientConfig =
                LettuceClientConfiguration.builder();
        if (redisSslEnabled) {
            clientConfig.useSsl();
        }

        return new LettuceConnectionFactory(config, clientConfig.build());
    }

    /**
     * IMPORTANT: reuses the SAME GenericJackson2JsonRedisSerializer bean defined in
     * CacheConfig, so RedisTemplate and RedisCacheManager always agree on how
     * polymorphic type info is written/read. Do NOT build a second serializer here.
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory,
            GenericJackson2JsonRedisSerializer redisJsonSerializer) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(redisJsonSerializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(redisJsonSerializer);

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public ApplicationRunner redisConnectionLogger(RedisConnectionFactory connectionFactory) {
        return args -> {
            try (var connection = connectionFactory.getConnection()) {
                String pong = connection.ping();
                log.info(
                        "Redis connection successful: host={}, port={}, ssl={}, username={}, ping={}",
                        redisHost,
                        redisPort,
                        redisSslEnabled,
                        mask(redisUsername),
                        pong
                );
            } catch (Exception ex) {
                log.error(
                        "Redis connection failed: host={}, port={}, ssl={}, username={}, error={}",
                        redisHost,
                        redisPort,
                        redisSslEnabled,
                        mask(redisUsername),
                        ex.getMessage(),
                        ex
                );
            }
        };
    }

    private String mask(String value) {
        if (value == null || value.isBlank()) {
            return "<empty>";
        }
        return value.length() <= 2
                ? "**"
                : value.charAt(0) + "***" + value.charAt(value.length() - 1);
    }
}