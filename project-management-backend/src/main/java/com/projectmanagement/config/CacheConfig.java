// CacheConfig.java
package com.projectmanagement.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.CachingConfigurer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.CacheErrorHandler;
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
@Slf4j
public class CacheConfig implements CachingConfigurer {

    /**
     * Single source of truth for Redis JSON serialization. Both RedisTemplate
     * (RedisConfig) and RedisCacheManager (below) MUST use this exact bean.
     * Never construct a second GenericJackson2JsonRedisSerializer elsewhere —
     * that's what caused the AsArrayTypeDeserializer / "@class" mismatch.
     */
    @Bean
    public GenericJackson2JsonRedisSerializer redisJsonSerializer() {
        return new GenericJackson2JsonRedisSerializer("@class")
                .configure(mapper -> mapper.findAndRegisterModules());
    }

    @Bean
    public RedisCacheManager cacheManager(
            RedisConnectionFactory connectionFactory,
            GenericJackson2JsonRedisSerializer redisJsonSerializer) {

        // NOTE: prefix bumped from pm:v2: to pm:v3: to invalidate any stale
        // entries written under the old, inconsistent serializer config.
        // Old pm:v2:* keys are simply orphaned and will expire off Upstash
        // naturally via their existing TTLs.
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .prefixCacheNameWith("pm:v3:")
                .entryTtl(Duration.ofMinutes(60))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(redisJsonSerializer));

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

    /**
     * CachingConfigurer.errorHandler() is what actually wires a CacheErrorHandler
     * into Spring's caching aspect. Just declaring @Bean CacheErrorHandler by
     * itself is NOT picked up automatically — that's why exceptions were
     * reaching the DispatcherServlet as 500s instead of being caught here.
     */
    @Override
    public CacheErrorHandler errorHandler() {
        return cacheErrorHandler();
    }

    @Bean
    public CacheErrorHandler cacheErrorHandler() {
        return new CacheErrorHandler() {
            @Override
            public void handleCacheGetError(RuntimeException exception, Cache cache, Object key) {
                log.warn(
                        "Ignoring unreadable cache entry: cache={}, key={}, error={}",
                        cache.getName(),
                        key,
                        exception.getMessage()
                );
                cache.evictIfPresent(key);
            }

            @Override
            public void handleCachePutError(
                    RuntimeException exception,
                    Cache cache,
                    Object key,
                    Object value) {
                log.warn(
                        "Ignoring cache put failure: cache={}, key={}, error={}",
                        cache.getName(),
                        key,
                        exception.getMessage()
                );
            }

            @Override
            public void handleCacheEvictError(RuntimeException exception, Cache cache, Object key) {
                log.warn(
                        "Ignoring cache evict failure: cache={}, key={}, error={}",
                        cache.getName(),
                        key,
                        exception.getMessage()
                );
            }

            @Override
            public void handleCacheClearError(RuntimeException exception, Cache cache) {
                log.warn(
                        "Ignoring cache clear failure: cache={}, error={}",
                        cache.getName(),
                        exception.getMessage()
                );
            }
        };
    }
}