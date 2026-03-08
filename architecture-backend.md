src/main/java/com/lcars/service/
│
├── domain/                         <-- Der reine Kern (0% Spring, 0% Mongo, 100% Java 21)
│   ├── model/                      
│   │   ├── LcarsEntry.java         <-- Aggregate Root (Record, keine Super-Entity)
│   │   └── traits/                 <-- Composition-Bausteine
│   │       ├── IdentityTrait.java  <-- Record
│   │       ├
│   │       └── LifecycleTrait.java <-- Record
│   ├── service/                    <-- Domain Services (Reine Business-Logik)
│   └── exception/                  <-- Domänenspezifische Fehler (z.B. EntryLockedException)
│
├── application/                    <-- Die Orchestrierung (Bindeglied)
│   ├── ports/
│   │   ├── in/                     <-- Use Case Interfaces (Was das UI darf)
│   │   │   └── ManageLcarsEntryUseCase.java
│   │   └── out/                    <-- Repository Interfaces (Was die DB können muss)
│   │       └── LcarsEntryRepository.java
│   └── services/                   <-- Use Case Implementierungen
│       └── LcarsEntryApplicationService.java
│
├── infrastructure/                 <-- Die Außenwelt (Frameworks, DBs, APIs)
│   ├── adapters/
│   │   ├── in/                     <-- Primäre Adapter (Eingang vom Frontend)
│   │   │   └── graphql/            <-- Spring GraphQL Resolver (Virtual Threads!)
│   │   │       └── LcarsEntryGraphQLAdapter.java
│   │   └── out/                    <-- Sekundäre Adapter (Ausgang zur Datenbank)
│   │       └── mongodb/            <-- Spring Data MongoDB
│   │           ├── LcarsEntryDocument.java <-- Das MongoDB-Dokument (@Document)
│   │           ├── SpringDataMongoRepo.java<-- Spring Data Interface
│   │           └── MongoPersistenceAdapter.java <-- Implementiert LcarsEntryRepository
│   └── config/                     <-- Spring Configuration
│       └── VirtualThreadConfig.java<-- Java 21 Virtual Thread Executor
│
└── LcarsServiceApplication.java    <-- Main Entry Point (Spring Boot)