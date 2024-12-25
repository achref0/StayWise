import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { searchHotels } from '../utils/api';
import HotelCard from './HotelCard';

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const governorate = searchParams.get('governorate');
    if (governorate) {
      setQuery(governorate);
      handleSearch(governorate);
    }
  }, [location]);

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchHotels(searchQuery);
      setSearchResults(results);
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`, { replace: true });
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <Container>
      <h1 className="text-center mb-4">Find Your Perfect Stay</h1>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search for a city or hotel"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                <i className="fas fa-search me-2"></i>
                Search
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : searchResults.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {searchResults.map((hotel) => (
            <Col key={hotel.hotelId}>
              <HotelCard hotel={hotel} />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center text-muted">
          No results found. Try a different search term.
        </p>
      )}
    </Container>
  );
}

export default Search;

