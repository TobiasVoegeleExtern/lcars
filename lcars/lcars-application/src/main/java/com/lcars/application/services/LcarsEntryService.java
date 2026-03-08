package com.lcars.application.services;

import com.lcars.application.ports.in.ManageLcarsEntryUseCase;
import com.lcars.application.ports.out.LcarsEntryRepository;
import com.lcars.core.domain.model.LcarsEntry;
import com.lcars.core.domain.model.LcarsFilter;
import com.lcars.core.domain.model.PaginatedResult;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public class LcarsEntryService implements ManageLcarsEntryUseCase {

    private final LcarsEntryRepository repository;

    public LcarsEntryService(LcarsEntryRepository repository) {
        this.repository = repository;
    }

    @Override
    public LcarsEntry createEntry(LcarsEntry entry) {
        // Ternary Operator: Statt isValid() direkt prüfen
        return entry != null ? repository.save(entry) : null;
    }

    @Override
    public Optional<LcarsEntry> getEntry(UUID id) {
        return id != null ? repository.findById(id) : Optional.empty();
    }

    @Override
    public List<LcarsEntry> getAllEntries() {
        List<LcarsEntry> results = repository.findAll();
        return results != null ? results : java.util.Collections.emptyList();
    }

    @Override
    public LcarsEntry updateEntry(UUID id, LcarsEntry entry) {
        // Ternary: Nur speichern, wenn ID und Daten vorhanden sind
        return id != null && entry != null ? repository.save(entry) : null;
    }

    @Override
    public boolean deleteEntry(UUID id) {
        return id != null ? repository.deleteById(id) : false;
    }

    @Override
    public PaginatedResult<LcarsEntry> searchEntries(LcarsFilter filter, int offset, int limit) {
        // Ternary Fallbacks für Limits zur absoluten Sicherheit
        int safeLimit = limit > 0 ? limit : 50;
        int safeOffset = offset >= 0 ? offset : 0;
        return repository.searchEntries(filter, safeOffset, safeLimit);
    }
}
/*
Der Hexagonale Architektur 

Wenn man sich  LcarsEntryService ansieht, 
stellst man fest: 

Er hat keine Ahnung, 
ob die Daten in einer MongoDB, 
einer Postgres oder einer simplen Textdatei landen. 

Er kennt nur das Interface LcarsEntryRepository. 
Genauso weiß er nicht, ob er von einer REST-API, 
GraphQL oder einem Terminal-Befehl aufgerufen wird.

*/