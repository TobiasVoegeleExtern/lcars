package com.lcars.core.domain.model.traits;

public record ClassificationTrait(String collectionName, String format) {
    public String getFullCategory() {
        return format != null && !format.isBlank() 
            ? collectionName + " [" + format + "]" 
            : collectionName;
    }
}