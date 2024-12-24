import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Building } from 'lucide-react';

const TUNISIAN_GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja",
  "Jendouba", "Kef", "Siliana", "Kairouan", "Kasserine", "Sidi Bouzid", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Gafsa", "Tozeur", "Kebili", "Gabès", "Medenine", "Tataouine"
];

function Home() {
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const navigate = useNavigate();

  const handleGovernorateChange = (event) => {
    setSelectedGovernorate(event.target.value);
  };

  const handleSearch = () => {
    if (selectedGovernorate) {
      navigate(`/search?governorate=${encodeURIComponent(selectedGovernorate)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Stay in Tunisia
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover the best hotels across Tunisia's beautiful governorates
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
        <div className="grid gap-8">
          <div className="flex flex-col space-y-4">
            <label htmlFor="governorate" className="text-lg font-medium text-gray-700">
              Select a Governorate
            </label>
            <div className="relative">
              <select
                id="governorate"
                value={selectedGovernorate}
                onChange={handleGovernorateChange}
                className="w-full p-4 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a governorate...</option>
                {TUNISIAN_GOVERNORATES.map((governorate) => (
                  <option key={governorate} value={governorate}>
                    {governorate}
                  </option>
                ))}
              </select>
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!selectedGovernorate}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-medium hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Search className="inline-block w-5 h-5 mr-2 -mt-1" />
            Search Hotels
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <Building className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">Browse through hundreds of hotels across Tunisia</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <Star className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
          <p className="text-gray-600">Compare prices from multiple booking platforms</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <MapPin className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Perfect Location</h3>
          <p className="text-gray-600">Find hotels in your preferred governorate</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

