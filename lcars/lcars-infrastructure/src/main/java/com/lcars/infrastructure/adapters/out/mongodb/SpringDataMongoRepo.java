package com.lcars.infrastructure.adapters.out.mongodb;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.UUID;

public interface SpringDataMongoRepo extends MongoRepository<LcarsEntryDocument, UUID> {
    
}