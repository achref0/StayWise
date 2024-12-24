import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelDetails } from '../utils/api';
import { Star, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function HotelDetails() {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchHotelDetails() {
      try {
        const data = await getHotelDetails(id);
        setHotel(data);
      } catch (err) {
        setError('Failed to fetch hotel details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchHotelDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-center">
        <p className="text-xl font-semibold mb-2">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-xl">No hotel details found.</p>
    </div>
  );

  // Filter out vendors with no prices
  const validPrices = hotel.comparison[0].filter((item, index) => (
    item[`price${index + 1}`] && item[`price${index + 1}`] !== 'N/A'
  ));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/search" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Search
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-64">
          <img 
            src="/placeholder.svg?height=400&width=800" 
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
            <button 
              onClick={() => window.open(`https://maps.google.com/?q=${hotel.geocode?.latitude},${hotel.geocode?.longitude}`, '_blank')}
              className="inline-flex items-center text-sm hover:underline"
            >
              <MapPin className="w-4 h-4 mr-1" />
              View on Map
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="ml-2 font-semibold">{hotel.reviews?.rating || 'N/A'}</span>
                <span className="ml-2 text-sm text-gray-600">
                  ({hotel.reviews?.count || 0} reviews)
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{hotel.telephone || 'Phone not available'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4">Price Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Vendor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Tax</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {validPrices.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {item[`vendor${index + 1}`]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        ${item[`price${index + 1}`]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        ${item[`tax${index + 1}`]}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        ${item[`Totalprice${index + 1}`]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;

