import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchHotels } from '../utils/api';
import SearchForm from './SearchForm';
import HotelCard from './HotelCard';
import { Loader } from 'lucide-react';

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const governorate = searchParams.get('governorate');
    if (governorate) {
      handleSearch(governorate);
    }
  }, [location]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchHotels(query);
      setSearchResults(results);
      navigate(`/search?query=${encodeURIComponent(query)}`, { replace: true });
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Hotels</h1>
        <SearchForm onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-center">
          {error}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((hotel) => (
            <HotelCard key={hotel.hotelId} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No results found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;

