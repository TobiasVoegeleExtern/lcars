package com.lcars.infrastructure.adapters.out.mongodb;

import com.lcars.application.ports.out.LcarsEntryRepository;
import com.lcars.core.domain.model.LcarsEntry;
import com.lcars.core.domain.model.LcarsFilter;
import com.lcars.core.domain.model.PaginatedResult;
import com.lcars.core.domain.model.traits.ClassificationTrait;
import com.lcars.core.domain.model.traits.IdentityTrait;
import com.lcars.core.domain.model.traits.LifecycleTrait;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class MongoPersistenceAdapter implements LcarsEntryRepository {

    private final SpringDataMongoRepo mongoRepo;
    private final MongoTemplate mongoTemplate;

    public MongoPersistenceAdapter(SpringDataMongoRepo mongoRepo, MongoTemplate mongoTemplate) {
        this.mongoRepo = mongoRepo;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public LcarsEntry save(LcarsEntry entry) {
        LcarsEntryDocument doc = entry != null ? mapToDoc(entry) : null;
        LcarsEntryDocument saved = doc != null ? mongoRepo.save(doc) : null;
        return saved != null ? mapToDomain(saved) : null;
    }

    @Override
    public Optional<LcarsEntry> findById(UUID id) {
        return id != null 
            ? mongoRepo.findById(id).map(this::mapToDomain) 
            : Optional.empty();
    }

    @Override
    public List<LcarsEntry> findAll() {
        List<LcarsEntryDocument> docs = mongoRepo.findAll();
        return docs != null 
            ? docs.stream().map(this::mapToDomain).toList() 
            : java.util.Collections.emptyList();
    }

   
    private boolean executeDelete(UUID id) {
        mongoRepo.deleteById(id);
        return true;
    }

    @Override
    public boolean deleteById(UUID id) {
        return id != null && mongoRepo.existsById(id) ? executeDelete(id) : false;
    }

    @Override
    public PaginatedResult<LcarsEntry> searchEntries(LcarsFilter filter, int offset, int limit) {
        Query query = new Query();

        query = filter != null && filter.systemTag() != null ? query.addCriteria(Criteria.where("systemTag").regex(filter.systemTag(), "i")) : query;
        query = filter != null && filter.collectionName() != null ? query.addCriteria(Criteria.where("collectionName").is(filter.collectionName())) : query;
        
        long total = mongoTemplate.count(query, LcarsEntryDocument.class);
        query.skip(offset).limit(limit);

        List<LcarsEntry> items = mongoTemplate.find(query, LcarsEntryDocument.class)
            .stream()
            .map(this::mapToDomain)
            .toList();

        return new PaginatedResult<>(items, total, offset, limit);
    }

    private LcarsEntryDocument mapToDoc(LcarsEntry domain) {
        return domain != null ? new LcarsEntryDocument(
            domain.identity() != null ? domain.identity().id() : null,
            domain.identity() != null ? domain.identity().systemTag() : null,
            domain.lifecycle() != null ? domain.lifecycle().created() : null,
            domain.lifecycle() != null ? domain.lifecycle().createdBy() : null,
            domain.lifecycle() != null ? domain.lifecycle().version() : 0L,
            domain.classification() != null ? domain.classification().collectionName() : null,
            domain.classification() != null ? domain.classification().format() : null,
            domain.dataFields()
        ) : null;
    }

    private LcarsEntry mapToDomain(LcarsEntryDocument doc) {
        return doc != null ? new LcarsEntry(
            new IdentityTrait(doc.id(), doc.systemTag()),
            new LifecycleTrait(doc.created(), doc.createdBy(), doc.version()),
            new ClassificationTrait(doc.collectionName(), doc.format()),
            doc.dataFields()
        ) : null;
    }
}