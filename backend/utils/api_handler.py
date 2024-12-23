import requests
import os
from typing import Dict, Any

class APIHandler:
    def __init__(self):
        self.base_url = "https://api.makcorps.com"
        self.api_key = os.getenv('MAKCORPS_API_KEY')

    def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict:
        """Make a request to the Makcorps API with the API key."""
        url = f"{self.base_url}/{endpoint}"
        # Always include api_key in params
        params['api_key'] = self.api_key
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def city_search(self, params: Dict[str, Any]) -> Dict:
        """Search hotels by city ID."""
        required_params = {
            'cityid': params.get('cityid'),
            'pagination': params.get('pagination', '0'),
            'cur': params.get('cur', 'USD'),
            'rooms': params.get('rooms', '1'),
            'adults': params.get('adults', '2'),
            'checkin': params.get('checkin'),
            'checkout': params.get('checkout'),
            'tax': params.get('tax', 'false'),
            'children': params.get('children', '0')
        }
        return self._make_request('city', required_params)

    def hotel_search(self, params: Dict[str, Any]) -> Dict:
        """Search prices for a specific hotel."""
        required_params = {
            'hotelid': params.get('hotelid'),
            'rooms': params.get('rooms', '1'),
            'adults': params.get('adults', '1'),
            'checkin': params.get('checkin'),
            'checkout': params.get('checkout')
        }
        return self._make_request('hotel', required_params)

    def booking_search(self, params: Dict[str, Any]) -> Dict:
        """Search Booking.com prices for a hotel."""
        required_params = {
            'country': params.get('country'),
            'hotelid': params.get('hotelid'),
            'checkin': params.get('checkin'),
            'checkout': params.get('checkout'),
            'currency': params.get('currency', 'USD'),
            'kids': params.get('kids', '0'),
            'adults': params.get('adults', '2'),
            'rooms': params.get('rooms', '1')
        }
        return self._make_request('booking', required_params)

    def mapping_search(self, params: Dict[str, Any]) -> Dict:
        """Search for hotel/city mapping information."""
        required_params = {
            'name': params.get('name')
        }
        return self._make_request('mapping', required_params)

    def get_account_info(self) -> Dict:
        """Get account information and API usage stats."""
        return self._make_request('account', {})

