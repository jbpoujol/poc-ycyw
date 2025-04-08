# Étape de build
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

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
