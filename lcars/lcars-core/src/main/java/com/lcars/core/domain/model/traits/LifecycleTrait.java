package com.lcars.core.domain.model.traits;

import java.time.LocalDateTime;


public record LifecycleTrait(LocalDateTime created, String createdBy, long version) {}