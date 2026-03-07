package com.lcars.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@Configuration
public class VirtualThreadConfig {

    @Bean
    public Executor taskExecutor() {
        boolean virtualThreadsEnabled = true;
        
        return virtualThreadsEnabled 
            ? Executors.newVirtualThreadPerTaskExecutor() 
            : Executors.newCachedThreadPool();
    }
}