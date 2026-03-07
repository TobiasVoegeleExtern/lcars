package com.lcars.application.ports.in;

import com.lcars.core.domain.model.LcarsEntry;
import com.lcars.core.domain.model.LcarsFilter;
import com.lcars.core.domain.model.PaginatedResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ManageLcarsEntryUseCase {
    LcarsEntry createEntry(LcarsEntry entry);
    Optional<LcarsEntry> getEntry(UUID id);
    List<LcarsEntry> getAllEntries();
    LcarsEntry updateEntry(UUID id, LcarsEntry entry);
    boolean deleteEntry(UUID id);
    PaginatedResult<LcarsEntry> searchEntries(LcarsFilter filter, int offset, int limit);
}