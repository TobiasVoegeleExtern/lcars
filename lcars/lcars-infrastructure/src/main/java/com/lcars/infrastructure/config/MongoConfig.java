package com.lcars.infrastructure.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import org.bson.UuidRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${mongodb.host:localhost}")
    private String host;

    @Value("${mongodb.port:27017}")
    private int port;

    @Value("${mongodb.database:lcars_db}")
    private String database;

    @Override
    protected String getDatabaseName() {
        return database;
    }

    @Override
    protected void configureClientSettings(MongoClientSettings.Builder builder) {
       builder.uuidRepresentation(UuidRepresentation.STANDARD)
       .applyConnectionString(new ConnectionString(
           // WICHTIG: 'mongodb' statt 'localhost'
           String.format("mongodb://root:secret@%s:%d/admin", "mongodb", port)
       ));
    }
}