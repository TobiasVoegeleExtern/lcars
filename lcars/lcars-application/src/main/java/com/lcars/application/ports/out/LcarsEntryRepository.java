package com.lcars.application.ports.out;

import com.lcars.core.domain.model.LcarsEntry;
import com.lcars.core.domain.model.LcarsFilter;
import com.lcars.core.domain.model.PaginatedResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LcarsEntryRepository {
    LcarsEntry save(LcarsEntry entry);
    Optional<LcarsEntry> findById(UUID id);
    List<LcarsEntry> findAll();
    boolean deleteById(UUID id);
    PaginatedResult<LcarsEntry> searchEntries(LcarsFilter filter, int offset, int limit);
}