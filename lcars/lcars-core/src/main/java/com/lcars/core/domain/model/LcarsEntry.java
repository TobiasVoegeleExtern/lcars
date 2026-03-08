package com.lcars.core.domain.model;

import com.lcars.core.domain.model.traits.ClassificationTrait;
import com.lcars.core.domain.model.traits.IdentityTrait;
import com.lcars.core.domain.model.traits.LifecycleTrait;

import java.util.Map;

/**
 * Das Haupt-Aggregat ohne den überflüssigen VisualTrait.
 */
public record LcarsEntry(
    IdentityTrait identity,
    LifecycleTrait lifecycle,
    ClassificationTrait classification,
    Map<String, Object> dataFields
) {}