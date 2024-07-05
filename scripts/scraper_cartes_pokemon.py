import requests
from bs4 import BeautifulSoup
import json
import os
import re

# Fonction pour récupérer les données existantes
def load_existing_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            return json.load(file)
    return []

# Fonction pour sauvegarder les données combinées
def save_data(filename, data):
    with open(filename, 'w') as file:
        json.dump(data, file, indent=4)

# Base URL
base_url = "https://www.pokecardex.com/series/"

# Liste des suffixes des URL des différentes séries
series_suffixes = ["PRWC", "BS", "JU", "FO", "BS2", "TR", "GH", "GC", "NG", "ND", "NR", "N4", "LC", "EX", "AQ", "SK"]

# Charger les données existantes
filename = 'wizards.json'
existing_data = load_existing_data(filename)

for suffix in series_suffixes:
    # Construire l'URL complète
    url = base_url + suffix
    
    # Récupérer le contenu de la page
    response = requests.get(url)

    soup = BeautifulSoup(response.content, "html.parser")
    page_title = soup.title.string.replace("Pokécardex - Série ", "")  # Enlever le préfixe "Pokécardex - Série"

    # Trouver toutes les balises div avec la classe appropriée
    cartes = []
    card_elements = soup.find_all("div", class_="serie-details-carte")

    for card in card_elements:
        # Chaque carte peut avoir son nom et son numéro dans l'attribut data-caption de la balise <a>
        a_tag = card.find("a", {"data-caption": True})
        if a_tag:
            data_caption = a_tag["data-caption"]
            # Ajouter directement le data-caption complet comme nom de la carte
            cartes.append({"name": data_caption})
        else:
            print("No a_tag found in card element")  # Log si aucun a_tag n'est trouvé

    # Ajouter les nouvelles données
    new_data = {
        "serie": page_title.strip(),
        "cartes": cartes
    }

    existing_data.append(new_data)

# Sauvegarder les données combinées
save_data(filename, existing_data)

print("Les données des cartes ont été écrites dans", filename)
