from flask import Flask, jsonify, request
from flask_cors import CORS
from utils.api_handler import APIHandler
from utils.data_processor import DataProcessor
import os

app = Flask(__name__)
CORS(app)

api_handler = APIHandler()
data_processor = DataProcessor()

@app.route('/api/city_search', methods=['GET'])
def city_search():
    """Handle city search requests."""
    try:
        params = {
            'cityid': request.args.get('cityid'),
            'pagination': request.args.get('pagination', '0'),
            'cur': request.args.get('cur', 'USD'),
            'rooms': request.args.get('rooms', '1'),
            'adults': request.args.get('adults', '2'),
            'checkin': request.args.get('checkin'),
            'checkout': request.args.get('checkout'),
            'tax': request.args.get('tax', 'false'),
            'children': request.args.get('children', '0')
        }
        raw_data = api_handler.city_search(params)
        processed_data = data_processor.process_city_search(raw_data)
        return jsonify(processed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/hotel_search', methods=['GET'])
def hotel_search():
    """Handle hotel search requests."""
    try:
        params = {
            'hotelid': request.args.get('hotelid'),
            'rooms': request.args.get('rooms', '1'),
            'adults': request.args.get('adults', '1'),
            'checkin': request.args.get('checkin'),
            'checkout': request.args.get('checkout')
        }
        raw_data = api_handler.hotel_search(params)
        processed_data = data_processor.process_hotel_search(raw_data)
        return jsonify(processed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/booking_search', methods=['GET'])
def booking_search():
    """Handle Booking.com search requests."""
    try:
        params = {
            'country': request.args.get('country'),
            'hotelid': request.args.get('hotelid'),
            'checkin': request.args.get('checkin'),
            'checkout': request.args.get('checkout'),
            'currency': request.args.get('currency', 'USD'),
            'kids': request.args.get('kids', '0'),
            'adults': request.args.get('adults', '2'),
            'rooms': request.args.get('rooms', '1')
        }
        raw_data = api_handler.booking_search(params)
        processed_data = data_processor.process_booking_search(raw_data)
        return jsonify(processed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/mapping', methods=['GET'])
def mapping():
    """Handle mapping search requests."""
    try:
        name = request.args.get('name')
        if not name:
            return jsonify({'error': 'Name parameter is required'}), 400
        raw_data = api_handler.mapping_search({'name': name})
        processed_data = data_processor.process_mapping_search(raw_data)
        return jsonify(processed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/account', methods=['GET'])
def account():
    """Handle account information requests."""
    try:
        data = api_handler.get_account_info()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

