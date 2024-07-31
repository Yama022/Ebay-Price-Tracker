FROM python:3.8-slim

WORKDIR /app

# Copier le fichier requirements.txt
COPY ./scripts/requirements.txt /app/requirements.txt

# Installer les dépendances
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copier le reste des scripts
COPY ./scripts /app/scripts

# Exposer le port 5000 si nécessaire
EXPOSE 5002

# Définir la commande par défaut pour exécuter le script
CMD ["python", "/app/scripts/check_prices.py"]
