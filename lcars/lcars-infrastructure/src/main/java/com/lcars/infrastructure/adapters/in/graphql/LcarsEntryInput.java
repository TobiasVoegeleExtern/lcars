package com.lcars.infrastructure.adapters.in.graphql;

/**
 * Dieses Record spiegelt exakt den 'input LcarsEntryInput' 
 * aus deiner schema.graphqls wider.
 */
public record LcarsEntryInput(
    String systemTag,
    String color,
    String icon,
    Boolean activeGlow,
    String collectionName,
    String format
) {}