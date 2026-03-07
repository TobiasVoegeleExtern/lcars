package com.lcars.core.domain.model;

import java.time.LocalDateTime;


public record LcarsFilter(
    String systemTag,
    String collectionName,
    String format,
    Boolean activeGlow,
    LocalDateTime createdAfter
) {}