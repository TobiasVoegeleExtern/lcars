package com.lcars.core.domain.model;

import java.util.List;

public record PaginatedResult<T>(
    List<T> items,
    long totalElements,
    int offset,
    int limit
) {
  
    public boolean hasNext() {
        return (offset + limit) < totalElements ? true : false;
    }
}