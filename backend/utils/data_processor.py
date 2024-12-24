from typing import Dict, List, Any

class DataProcessor:
    def process_city_search(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process city search results."""
        if not data or not isinstance(data, list):
            return []
            
        # Remove the pagination info if it's the last item
        if data and isinstance(data[-1], list) and len(data[-1]) == 1 and 'totalHotelCount' in data[-1][0]:
            data = data[:-1]

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

                # Process vendor and price information
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
        if not data or 'comparison' not in data or not data['comparison']:
            return {'comparison': [[]]}

        processed_data = []
        for item in data['comparison'][0]:
            processed_item = {}
            for key, value in item.items():
                if key.startswith(('vendor', 'price', 'tax', 'Totalprice')):
                    processed_item[key] = value
            processed_data.append(processed_item)

        return {'comparison': [processed_data]}

    def process_booking_search(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process Booking.com search results."""
        if not data or not isinstance(data, list):
            return []

        # Extract room information from the first element if it's a list
        rooms_data = data[0] if isinstance(data[0], list) else []
        
        processed_data = []
        for room in rooms_data:
            if isinstance(room, dict):
                processed_room = {
                    'room': room.get('room', ''),
                    'price': room.get('price', ''),
                    'payment_details': room.get('payment_details', [])
                }
                processed_data.append(processed_room)

        return processed_data

    def process_mapping_search(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process mapping search results."""
        if not data or not isinstance(data, list):
            return []
            
        processed_data = []
        for item in data:
            if isinstance(item, dict):
                processed_item = {
                    'id': item.get('document_id', ''),  # Primary ID
                    'value': item.get('value', ''),     # Alternative ID
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

