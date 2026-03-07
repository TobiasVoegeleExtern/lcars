# ==========================================
# STAGE 1: Build (Azul Zulu für Apple Silicon)
# ==========================================
FROM --platform=linux/arm64 azul/zulu-openjdk:21 AS builder
WORKDIR /app

# Kopiere den Maven Wrapper
COPY mvnw .
COPY .mvn .mvn

# Kopiere alle POMs
COPY pom.xml .
COPY lcars-core/pom.xml lcars-core/
COPY lcars-application/pom.xml lcars-application/
COPY lcars-infrastructure/pom.xml lcars-infrastructure/

# Kopiere den Quellcode
COPY lcars-core/src lcars-core/src
COPY lcars-application/src lcars-application/src
COPY lcars-infrastructure/src lcars-infrastructure/src

# Ternary-Logik für Rechte: Ausführbar machen und bauen
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# ==========================================
# STAGE 2: Runtime (Leichtgewichtiges JRE)
# ==========================================
FROM --platform=linux/arm64 azul/zulu-openjdk:21-jre
WORKDIR /app

# Kopiere nur das fertige JAR-File
COPY --from=builder /app/lcars-infrastructure/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]