import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { getGovernorateInfo, searchHotels } from '../utils/api';
import HotelCard from './HotelCard';
import Carousel from 'react-bootstrap/Carousel';  // Import Carousel component

function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [governorateInfo, setGovernorateInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [showHotels, setShowHotels] = useState(false);  // State to control hotel section visibility
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const governorate = searchParams.get('governorate');
    if (governorate) {
      setQuery(governorate);
      fetchGovernorateInfo(governorate);
    }
  }, [location]);

  const fetchGovernorateInfo = async (governorate) => {
    setLoading(true);
    setError(null);
    try {
      const info = await getGovernorateInfo(governorate);
      console.log("Governorate Info: ", info);
      if (!info.introduction && !info.images.length) {
        setError('No information found for the selected governorate.');
      }
      setGovernorateInfo(info);
      setShowHotels(false);  // Reset showHotels state when new governorate is fetched
    } catch (err) {
      console.error('Error fetching governorate info:', err);
      setError('An error occurred while fetching governorate info. Please try again.');
    }
    setLoading(false);
  };

  const handleSearchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchHotels(query);
      setSearchResults(results);
      setShowHotels(true);  // Show hotels section after search
    } catch (err) {
      console.error('Error during hotel search:', err);
      if (err.response && err.response.status === 429) {
        setError('Request limit reached for hotel search. Please try again later.');
      } else {
        setError('An error occurred while searching for hotels. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchGovernorateInfo(query);
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
                placeholder="Search for a city or governorate"
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
      ) : (
        <>
          {governorateInfo && (
            <div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.5em', color: '#333' }}>{governorateInfo.introduction}</h2>
              <Carousel>
                {governorateInfo.images.map((img, index) => (
                  <Carousel.Item key={`image-${index}`}>
                    <img className="d-block w-100 carousel-image" src={`https:${img}`} alt={`Slide ${index}`} />
                  </Carousel.Item>
                ))}
              </Carousel>
              <Button variant="secondary" className="mt-3" onClick={handleSearchHotels}>
                Look for Hotels
              </Button>
            </div>
          )}
          {showHotels && (
            <>
              <h3 className="mt-4">Hotel Search Results</h3>
              {searchResults.length > 0 ? (
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
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Search;
