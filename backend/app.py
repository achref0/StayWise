from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.api_handler import APIHandler
from utils.data_processor import DataProcessor
import os
import logging
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

api_handler = APIHandler()
data_processor = DataProcessor()

# Fallback mapping of governorates to city IDs
TUNISIAN_GOVERNORATES = {
    "Tunis": 2629167,
    "Ariana": 2629124,
    "Ben Arous": 2629136,
    "Manouba": 2629154,
    "Nabeul": 2629157,
    "Zaghouan": 2629168,
    "Bizerte": 2629137,
    "Béja": 2629135,
    "Jendouba": 2629142,
    "Kef": 2629152,
    "Siliana": 2629161,
    "Kairouan": 2629143,
    "Kasserine": 2629146,
    "Sidi Bouzid": 2629160,
    "Sousse": 2629162,
    "Monastir": 2629348,
    "Mahdia": 2629153,
    "Sfax": 2629159,
    "Gafsa": 2629141,
    "Tozeur": 2629166,
    "Kebili": 2629148,
    "Gabès": 2629138,
    "Medenine": 2629156,
    "Tataouine": 2629165
}

@app.route('/api/search', methods=['GET'])
def search_hotels():
    """Handle hotel search requests for governorates or specific queries."""
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        city_id = None
        
        # First, check if the query matches a governorate name
        if query in TUNISIAN_GOVERNORATES:
            city_id = TUNISIAN_GOVERNORATES[query]
            logging.debug(f"Using predefined city ID for {query}: {city_id}")
        else:
            # If not, try mapping search to get the city ID
            logging.debug(f"Attempting mapping search for query: {query}")
            mapping_results = api_handler.mapping_search(query)
            processed_mapping = data_processor.process_mapping_search(mapping_results)

            if processed_mapping:
                city_id = processed_mapping[0]['id']
                logging.debug(f"Mapping search successful. City ID: {city_id}")
            else:
                logging.warning(f"No mapping results found for query: {query}")

        if city_id:
            # Use the city ID to search for hotels
            logging.debug(f"Searching for hotels with city ID: {city_id}")
            checkin = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
            checkout = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
            city_results = api_handler.city_search(
                cityid=str(city_id),
                checkin=checkin,
                checkout=checkout
            )
            processed_city = data_processor.process_city_search(city_results)
            return jsonify(processed_city)
        else:
            logging.warning(f"No city ID found for query: {query}")
            return jsonify([])

    except Exception as e:
        logging.error(f"Error in search_hotels: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/hotel_search', methods=['GET'])
def hotel_search():
    """Handle hotel search requests."""
    try:
        hotelid = request.args.get('hotelid')
        if not hotelid:
            return jsonify({"error": "Hotel ID is required"}), 400

        checkin = request.args.get('checkin', (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d'))
        checkout = request.args.get('checkout', (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d'))
        rooms = request.args.get('rooms', '1')
        adults = request.args.get('adults', '1')

        raw_data = api_handler.hotel_search(
            hotelid=hotelid,
            checkin=checkin,
            checkout=checkout,
            rooms=rooms,
            adults=adults
        )
        processed_data = data_processor.process_hotel_search(raw_data)
        return jsonify(processed_data)
    except Exception as e:
        logging.error(f"Error in hotel_search: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/account', methods=['GET'])
def get_account_info():
    """Get account information and API usage stats."""
    try:
        account_data = api_handler.get_account_info()
        return jsonify(account_data)
    except Exception as e:
        logging.error(f"Error in get_account_info: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

