from typing import Dict, List, Any

class DataProcessor:
    def process_mapping_search(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process mapping search results."""
        if not data or not isinstance(data, list):
            return []
            
        processed_data = []
        for item in data:
            if isinstance(item, dict):
                processed_item = {
                    'id': item.get('document_id', ''),
                    'value': item.get('value', ''),
                    'name': item.get('name', ''),
                    'type': item.get('type', ''),
                    'details': {
                        'address': item.get('details', {}).get('address', ''),
                        'parent_name': item.get('details', {}).get('parent_name', ''),
                        'grandparent_name': item.get('details', {}).get('grandparent_name', '')
                    }
                }
                processed_data.append(processed_item)
                
        return processed_data

    def process_city_search(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process city search results."""
        if not data or not isinstance(data, list):
            return []
            
        processed_data = []
        for hotel in data:
            if isinstance(hotel, dict):
                processed_hotel = {
                    'geocode': hotel.get('geocode', {'latitude': 0, 'longitude': 0}),
                    'telephone': hotel.get('telephone', ''),
                    'name': hotel.get('name', ''),
                    'hotelId': hotel.get('hotelId', ''),
                    'reviews': hotel.get('reviews', {'rating': 0, 'count': 0})
                }

                for i in range(1, 5):  # Assuming max 4 vendors
                    vendor_key = f'vendor{i}'
                    price_key = f'price{i}'
                    if vendor_key in hotel and price_key in hotel:
                        processed_hotel[vendor_key] = hotel[vendor_key]
                        processed_hotel[price_key] = hotel[price_key]

                processed_data.append(processed_hotel)

        return processed_data

    def process_hotel_search(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process hotel search results."""
        if not data or 'comparison' not in data:
            return {'comparison': [[]]}

        processed_data = []
        for item in data['comparison'][0]:
            processed_item = {}
            for key, value in item.items():
                if key.startswith(('vendor', 'price', 'tax', 'Totalprice')):
                    processed_item[key] = value
            processed_data.append(processed_item)

        return {'comparison': [processed_data]}

