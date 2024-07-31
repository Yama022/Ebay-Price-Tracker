from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, resources={r"/search_ebay": {"origins": "http://localhost:3000"}})

@app.route('/search_ebay', methods=['POST'])
def search_ebay():
    data = request.get_json()
    name = data['name']
    number = data['number']
    society = data.get('society', '')
    note = data.get('note', '')
    
    # Construire l'URL de recherche
    search_query = f"{name} {number}"
    if society and note:
        search_query += f" {society} {note}"
    search_url = f"https://www.ebay.fr/sch/i.html?_from=R40&_nkw={search_query}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1"

    # Effectuer la requête HTTP vers eBay
    response = requests.get(search_url, verify=False)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        prices = soup.find_all('span', class_='s-item__price')
        prices_list = []
        for price in prices:
            strike_through_positive = price.find('span', class_='STRIKETHROUGH POSITIVE')
            if not strike_through_positive:
                parent = price.find_parent("div", class_="s-item__info clearfix")
                if parent:
                    title = parent.find("span", role="heading")
                    if title:
                        card_name = title.get_text()
                        if society and note:
                            if society in card_name and str(note) in card_name:
                                prices_list.append({
                                    'name': card_name,
                                    'price': price.get_text()
                                })
                        else:
                            prices_list.append({
                                'name': card_name,
                                'price': price.get_text()
                            })
        if not prices_list:
            return jsonify({"message": f"Aucun résultat trouvé pour {name} {number} avec la société {society} et la note {note}"}), 200
        return jsonify(prices_list)
    else:
        return jsonify({"error": "Failed to fetch data from eBay"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
