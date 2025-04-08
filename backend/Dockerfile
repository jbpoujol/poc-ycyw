FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copier les fichiers de configuration Maven
COPY pom.xml .
COPY src ./src

# Construire l'application
RUN mvn clean package -DskipTests

# Image finale
FROM eclipse-temurin:21-jre-alpine

# Installation des outils pour le healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copier le JAR construit
COPY --from=build /app/target/*.jar app.jar

# Exposer le port
EXPOSE 8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]
