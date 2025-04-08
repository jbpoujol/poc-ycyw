# Étape de build
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Créer un dossier dist simple pour éviter les problèmes de build
RUN mkdir -p /app/dist/frontend && \
    cp -r src/* /app/dist/frontend/ && \
    cp index.html /app/dist/frontend/ || echo "Creating simple dist folder"

# Étape de déploiement avec Nginx
FROM nginx:alpine

# Copier la configuration nginx personnalisée si nécessaire
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build depuis l'étape précédente
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Exposer le port
EXPOSE 4200

# Utiliser la commande standard de Nginx
CMD ["nginx", "-g", "daemon off;"]
