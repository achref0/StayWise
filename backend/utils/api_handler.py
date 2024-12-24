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

