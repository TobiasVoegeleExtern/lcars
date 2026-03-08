package com.lcars.infrastructure.adapters.out.mongodb;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Document(collection = "lcars_entries")
public record LcarsEntryDocument(
    @Id UUID id,
    String systemTag,
    LocalDateTime created,
    String createdBy,
    long version,
    String collectionName,
    String format,
    Map<String, Object> dataFields
) {}