# Étape 1 : Build Angular
FROM node:20 AS build

# Définir l'argument de build (local ou cloud)
ARG BUILD_ENV=cloud

WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copier le code source
COPY . .

# Build en fonction de l'environnement
RUN if [ "$BUILD_ENV" = "local" ]; then \
      npm run build; \
    else \
      npm run build:cloud; \
    fi

# Étape 2 : Serveur Nginx
FROM nginx:stable-alpine

# Copier les fichiers compilés Angular dans nginx
COPY --from=build /app/dist/frontend-angular /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 8080
EXPOSE 8080

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]





