package com.projectmanagement.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.Map;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .withInitialCacheConfigurations(Map.of(
                        "workspaces", config.entryTtl(Duration.ofMinutes(30)),
                        "projects", config.entryTtl(Duration.ofMinutes(20)),
                        "projectStats", config.entryTtl(Duration.ofMinutes(10)),
                        "tasks", config.entryTtl(Duration.ofMinutes(10)),
                        "sprints", config.entryTtl(Duration.ofMinutes(10)),
                        "analytics", config.entryTtl(Duration.ofMinutes(15)),
                        "users", config.entryTtl(Duration.ofMinutes(20))
                ))
                .build();
    }
}
