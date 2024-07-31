# Utiliser l'image officielle Node.js 18
FROM node:18

# Créer et définir le répertoire de travail de l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Ajouter cette ligne pour s'assurer que les fichiers ont les bonnes permissions
RUN chmod -R 755 /app

# Copier les fichiers de l'application
COPY . .

# Ajouter cette ligne pour s'assurer que les fichiers exécutables dans node_modules/.bin ont les bonnes permissions
RUN chmod -R 755 /app/node_modules/.bin

# Exposer le port sur lequel l'application va écouter
EXPOSE 3000

# Lancer l'application
CMD ["npm", "run", "dev"]
