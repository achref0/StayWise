import requests
import os
import logging
from typing import Dict, Any
from urllib.parse import quote

class APIHandler:
    def __init__(self):
        self.base_url = "https://api.makcorps.com"
        self.api_key = os.getenv('MAKCORPS_API_KEY')
        logging.basicConfig(level=logging.DEBUG)

    def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict:
        """Make a request to the Makcorps API with the API key."""
        url = f"{self.base_url}/{endpoint}"
        params['api_key'] = self.api_key
        
        # URL encode the parameters
        encoded_params = "&".join(f"{k}={quote(str(v))}" for k, v in params.items())
        full_url = f"{url}?{encoded_params}"
        
        logging.debug(f"Making API request to: {full_url}")

        response = requests.get(full_url)
        
        logging.debug(f"API response status code: {response.status_code}")
        
        if response.status_code != 200:
            logging.error(f"API request failed. Status code: {response.status_code}")
            logging.error(f"Response content: {response.text}")
        
        response.raise_for_status()
        return response.json()

    def mapping_search(self, name: str) -> Dict:
        """Search for hotel/city mapping information."""
        params = {'name': name}
        return self._make_request('mapping', params)

    def city_search(self, cityid: str, checkin: str, checkout: str, rooms: str = '1', adults: str = '2', cur: str = 'USD') -> Dict:
        """Search hotels by city ID."""
        params = {
            'cityid': cityid,
            'pagination': '0',
            'cur': cur,
            'rooms': rooms,
            'adults': adults,
            'checkin': checkin,
            'checkout': checkout
        }
        return self._make_request('city', params)

    def hotel_search(self, hotelid: str, checkin: str, checkout: str, rooms: str = '1', adults: str = '1') -> Dict:
        """Search prices for a specific hotel."""
        params = {
            'hotelid': hotelid,
            'rooms': rooms,
            'adults': adults,
            'checkin': checkin,
            'checkout': checkout
        }
        return self._make_request('hotel', params)

    def get_account_info(self) -> Dict:
        """Get account information and API usage stats."""
        return self._make_request('account', {})

    def fetch_wikipedia_intro(self, governorate: str) -> str:
        """Fetch the introduction section of a Wikipedia page."""
        intro_mappings = {
            "Tunis": "Tunis_Governorate",
            "Ariana": "Ariana_Governorate",
            "Ben Arous": "Ben_Arous_Governorate",
            "Manouba": "Manouba_Governorate",
            "Nabeul": "Nabeul_Governorate",
            "Zaghouan": "Zaghouan_Governorate",
            "Bizerte": "Bizerte_Governorate",
            "Béja": "Béja_Governorate",
            "Jendouba": "Jendouba_Governorate",
            "Kef": "Kef_Governorate",
            "Siliana": "Siliana_Governorate",
            "Kairouan": "Kairouan_Governorate",
            "Kasserine": "Kasserine_Governorate",
            "Sidi Bouzid": "Sidi_Bouzid_Governorate",
            "Sousse": "Sousse_Governorate",
            "Monastir": "Monastir_Governorate",
            "Mahdia": "Mahdia_Governorate",
            "Sfax": "Sfax_Governorate",
            "Gafsa": "Gafsa_Governorate",
            "Tozeur": "Tozeur_Governorate",
            "Kebili": "Kebili_Governorate",
            "Gabès": "Gabès_Governorate",
            "Medenine": "Medenine_Governorate",
            "Tataouine": "Tataouine_Governorate"
        }

        query_name = intro_mappings.get(governorate, governorate)
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{quote(query_name)}"
        logging.debug(f"Fetching Wikipedia intro for: {query_name}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get('extract', "No introduction available.")

    def fetch_wikipedia_images(self, governorate: str) -> list:
        """Fetch images related to a Wikipedia page."""
        image_mappings = {
            "Tunis": "Tunis",
            "Ariana": "Ariana_(Tunisia)",
            "Ben Arous": "Ben_Arous_Governorate",
            "Manouba": "Manouba",
            "Nabeul": "Nabeul",
            "Zaghouan": "Zaghouan",
            "Bizerte": "Bizerte",
            "Béja": "Béja",
            "Jendouba": "Jendouba",
            "Kef": "El_Kef",
            "Siliana": "Siliana",
            "Kairouan": "Kairouan",
            "Kasserine": "Kasserine_Governorate",
            "Sidi Bouzid": "Sidi_Bouzid",
            "Sousse": "Sousse",
            "Monastir": "Monastir,_Tunisia",
            "Mahdia": "Mahdia",
            "Sfax": "Sfax",
            "Gafsa": "Gafsa",
            "Tozeur": "Tozeur",
            "Kebili": "Kebili",
            "Gabès": "Gabès",
            "Medenine": "Medenine",
            "Tataouine": "Tataouine"
        }

        query_name = image_mappings.get(governorate, governorate)
        url = f"https://en.wikipedia.org/api/rest_v1/page/media-list/{quote(query_name)}"
        logging.debug(f"Fetching Wikipedia images for: {query_name}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return [
            item['srcset'][-1]['src']  # Get the highest resolution image
            for item in data.get('items', []) if item.get('type') == 'image'
        ]
