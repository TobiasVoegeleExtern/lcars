package com.lcars.infrastructure.config;

import com.lcars.application.ports.in.ManageLcarsEntryUseCase;
import com.lcars.application.ports.out.LcarsEntryRepository;
import com.lcars.application.services.LcarsEntryService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HexagonalConfig {

    @Bean
    public ManageLcarsEntryUseCase manageLcarsEntryUseCase(LcarsEntryRepository repository) {
        return repository != null ? new LcarsEntryService(repository) : null;
    }
}