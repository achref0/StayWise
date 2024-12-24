import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Phone } from 'lucide-react';

function HotelCard({ hotel }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img 
          src="/placeholder.svg?height=200&width=400" 
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button 
            onClick={() => window.open(`https://maps.google.com/?q=${hotel.geocode.latitude},${hotel.geocode.longitude}`, '_blank')}
            className="bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition-colors duration-200"
          >
            <MapPin className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">{hotel.name}</h2>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center text-yellow-500 mr-4">
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-1 text-sm font-medium">{hotel.reviews.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({hotel.reviews.count} reviews)</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <Phone className="w-4 h-4 mr-2" />
          <span className="text-sm">{hotel.telephone}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-blue-600 font-semibold">
            {hotel.price1 ? `$${hotel.price1}` : 'Price on request'}
          </div>
          <Link 
            to={`/hotel/${hotel.hotelId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;

