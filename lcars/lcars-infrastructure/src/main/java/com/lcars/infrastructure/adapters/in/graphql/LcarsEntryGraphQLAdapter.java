package com.lcars.infrastructure.adapters.in.graphql;

import com.lcars.application.ports.in.ManageLcarsEntryUseCase;
import com.lcars.core.domain.model.*;
import com.lcars.core.domain.model.traits.*;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.UUID;

@Controller
public class LcarsEntryGraphQLAdapter {

    private final ManageLcarsEntryUseCase useCase;

    public LcarsEntryGraphQLAdapter(ManageLcarsEntryUseCase useCase) {
        this.useCase = useCase;
    }

    @QueryMapping
    public PaginatedResult<LcarsEntry> searchEntries(
        @Argument LcarsFilter filter, 
        @Argument Integer offset, 
        @Argument Integer limit
    ) {
        return useCase.searchEntries(filter, offset != null ? offset : 0, limit != null ? limit : 50);
    }

    @MutationMapping
    public LcarsEntry createEntry(@Argument("input") LcarsEntryInput input) {
        return input != null ? useCase.createEntry(mapInputToDomain(input)) : null;
    }

   private LcarsEntry mapInputToDomain(LcarsEntryInput input) {
    return new LcarsEntry(
        new IdentityTrait(UUID.randomUUID(), input.systemTag() != null ? input.systemTag() : "NEW_RECORD"),
        new LifecycleTrait(LocalDateTime.now(), "LCARS_USER", 1L),
        new ClassificationTrait(
            input.collectionName() != null ? input.collectionName() : "AUDIO",
            input.format() != null ? input.format() : "CD"
        ),
        new HashMap<>() 
    );
}

    @MutationMapping
    public Boolean deleteEntry(@Argument UUID id) {
        return id != null ? useCase.deleteEntry(id) : false;
    }
}