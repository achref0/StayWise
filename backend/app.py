from flask import Flask, send_from_directory, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta
import jwt
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from utils.api_handler import APIHandler
from utils.data_processor import DataProcessor
import logging
import mysql.connector
from mysql.connector import Error

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize API handler and data processor
api_handler = APIHandler()
data_processor = DataProcessor()

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
# Simple cache to store city IDs for previously searched queries
city_id_cache = {}

# JWT Secret Key
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET')

# Database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        return conn
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        return None


# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing!'}), 401
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = get_user_by_id(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# User management functions
def get_user_by_id(user_id):
    conn = get_db_connection()
    if conn is None:
        return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, email, name FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        return user
    except Error as e:
        print(f"Error: {e}")
        return None
    finally:
        conn.close()

def get_user_by_username(username):
    conn = get_db_connection()
    if conn is None:
        return None
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        return user
    except Error as e:
        print(f"Error: {e}")
        return None
    finally:
        conn.close()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
        
# Authentication routes
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    name = data.get('name')

    if not username or not password or not email or not name:
        return jsonify({'message': 'Missing required fields'}), 400

    if get_user_by_username(username):
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({'message': 'Database connection error'}), 500
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password_hash, email, name) VALUES (%s, %s, %s, %s)", 
                       (username, hashed_password, email, name))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Database error'}), 500
    finally:
        conn.close()

    token = jwt.encode({'user_id': user_id, 'exp': datetime.utcnow() + timedelta(days=30)}, app.config['SECRET_KEY'])
    
    resp = make_response(jsonify({'message': 'User created successfully'}), 201)
    resp.set_cookie('token', token, httponly=True, secure=True, samesite='Strict', max_age=30*24*60*60)
    return resp

@app.route('/api/login', methods=['POST'])
def login():
    auth = request.get_json()
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    user = get_user_by_username(auth.get('username'))
    
    if not user:
        return jsonify({'message': 'User not found'}), 401
    
    if check_password_hash(user['password_hash'], auth.get('password')):
        token = jwt.encode({'user_id': user['id'], 'exp': datetime.utcnow() + timedelta(days=30)}, app.config['SECRET_KEY'])
        return jsonify({
            'message': 'Logged in successfully',
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'name': user['name']
            }
        }), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/api/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({'message': 'Logged out successfully'}), 200)
    resp.set_cookie('token', '', expires=0)
    return resp

@app.route('/api/current-user', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'id': current_user['id'],
        'username': current_user['username'],
        'email': current_user['email'],
        'name': current_user['name']
    }), 200

@app.route('/api/user-settings', methods=['PUT'])
@token_required
def update_user_settings(current_user):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    conn = get_db_connection()
    if conn is None:
        return jsonify({'message': 'Database connection error'}), 500
    try:
        cursor = conn.cursor()
        if name:
            cursor.execute("UPDATE users SET name = %s WHERE id = %s", (name, current_user['id']))
        if email:
            cursor.execute("UPDATE users SET email = %s WHERE id = %s", (email, current_user['id']))
        if password:
            hashed_password = generate_password_hash(password)
            cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s", (hashed_password, current_user['id']))
        conn.commit()
        cursor.close()
    except Error as e:
        print(f"Error: {e}")
        return jsonify({'message': 'Database error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'User settings updated successfully'}), 200

# Existing routes (now with authentication where necessary)

@app.route('/api/hotel_search', methods=['GET'])
@token_required
def hotel_search(current_user):
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
        logging.debug(f"Raw data from API: {raw_data}")
        
        processed_data = data_processor.process_hotel_search(raw_data)
        logging.debug(f"Processed data: {processed_data}")
        
        if 'comparison' in processed_data and processed_data['comparison']:
            filtered_comparison = [
                {k: v for k, v in vendor.items() if v is not None and k.startswith(('vendor', 'price', 'tax', 'Totalprice'))}
                for vendor in processed_data['comparison'][0]
                if any(v is not None and k.startswith('price') for k, v in vendor.items())
            ]
            logging.debug(f"Filtered comparison: {filtered_comparison}")
            return jsonify({'comparison': [filtered_comparison]})
        else:
            logging.warning("No comparison data available")
            return jsonify({'error': 'No comparison data available'}), 404
    except Exception as e:
        logging.error(f"Error in hotel_search: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/account', methods=['GET'])
@token_required
def get_account_info(current_user):
    """Get account information and API usage stats."""
    try:
        account_info = api_handler.get_account_info()
        return jsonify(account_info)
    except Exception as e:
        logging.error(f"Error in get_account_info: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/governorate-info/<governorate>', methods=['GET'])
def get_governorate_info(governorate):
    """Get information about a specific governorate."""
    try:
        intro = api_handler.fetch_wikipedia_intro(governorate)
        images = api_handler.fetch_wikipedia_images(governorate)
        return jsonify({'introduction': intro, 'images': images})
    except Exception as e:
        logging.error(f"Error in get_governorate_info: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_hotels():
    """Handle hotel search requests for governorates or specific queries."""
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        city_id = None
        
        # Check if the city ID has been cached previously
        if query in city_id_cache:
            city_id = city_id_cache[query]
            logging.debug(f"Using cached city ID for {query}: {city_id}")
        else:
            # First, check if the query matches a governorate name (used only when selecting a governorate)
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

            # Cache the city ID for future use
            if city_id:
                city_id_cache[query] = city_id

        if city_id:
            # Use the city ID to search for hotels
            logging.debug(f"Searching for hotels with city ID: {city_id}")
            checkin = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
            checkout = (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d')
            try:
                city_results = api_handler.city_search(
                    cityid=str(city_id),
                    checkin=checkin,
                    checkout=checkout
                )
                processed_city = data_processor.process_city_search(city_results)
                return jsonify(processed_city)
            except request.exceptions.HTTPError as e:
                if e.response.status_code == 429:
                    logging.error(f"Error in search_hotels: {str(e)}")
                    return jsonify({"error": "Request limit reached. Please try again later."}), 429
                else:
                    raise e
        else:
            logging.warning(f"No city ID found for query: {query}")
            return jsonify([])

    except Exception as e:
        logging.error(f"Error in search_hotels: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/test-auth', methods=['GET'])
@token_required
def test_auth(current_user):
    return jsonify({
        'message': 'Authentication successful',
        'user': {
            'id': current_user['id'],
            'username': current_user['username'],
            'email': current_user['email']
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

