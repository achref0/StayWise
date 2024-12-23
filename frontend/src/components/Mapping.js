import React, { useState } from 'react';
import { searchMapping } from '../utils/api';

function Mapping() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchMapping(event.target.name.value);
      setResults(data);
    } catch (err) {
      setError('An error occurred while fetching data');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Hotel/City Mapping</h1>
      <form onSubmit={handleSearch} className="search-container">
        <input type="text" id="name" placeholder="Enter Hotel/City Name" required />
        <button type="submit">Search Mapping</button>
      </form>
      {loading && <div id="loader" className="loader"></div>}
      {error && <div className="error">{error}</div>}
      {results && (
        <div id="mapping-results">
          <h2>Mapping Results</h2>
          <ul>
            {results.map((item, index) => (
              <li key={index}>ID: {item.id}, Name: {item.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Mapping;

