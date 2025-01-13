import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Spinner, Table } from 'react-bootstrap';
import { getHotelDetails } from '../utils/api';

function HotelDetails() {
  const [hotel, setHotel] = useState(null);
  const [priceComparison, setPriceComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let hotelData = location.state?.hotel;
        
        if (!hotelData) {
          const storedResults = JSON.parse(localStorage.getItem('hotelSearchResults') || '[]');
          hotelData = storedResults.find(h => h.hotelId === id);
        }
        
        if (hotelData) {
          setHotel(hotelData);
        } else {
          const fetchedHotel = await getHotelDetails(id);
          if (fetchedHotel) {
            setHotel(fetchedHotel);
          } else {
            setError('Hotel details not found. Please try searching again.');
          }
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to fetch hotel details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, location.state]);

  const handleGetPriceComparison = async () => {
    setLoading(true);
    try {
      const data = await getHotelDetails(id);
      console.log('Price comparison data:', data);
      if (data && data.comparison && data.comparison[0]) {
        setPriceComparison(data.comparison[0]);
      } else {
        setError('No price comparison data available.');
      }
    } catch (err) {
      console.error('Error fetching price comparison:', err);
      setError('Failed to fetch price comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
      <Link to="/search" className="btn btn-primary">
        Back to Search
      </Link>
    </Container>
  );

  if (!hotel) return (
    <Container className="mt-5">
      <p className="text-center text-muted">No hotel details found.</p>
      <Link to="/search" className="btn btn-primary">
        Back to Search
      </Link>
    </Container>
  );

  return (
    <Container className="my-5">
      <Link to="/search" className="btn btn-outline-primary mb-4">
        <i className="fas fa-arrow-left me-2"></i>
        Back to Search
      </Link>

      <Card className="shadow-lg">
        <Card.Img variant="top" src="/placeholder.svg?height=400&width=800" alt={hotel.name} />
        <Card.Body>
          <Card.Title as="h1" className="mb-4">{hotel.name}</Card.Title>
          <Row className="mb-4">
            <Col md={6}>
              <p>
                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                <Button 
                  variant="link"
                  onClick={() => window.open(`https://maps.google.com/?q=${hotel.geocode?.latitude},${hotel.geocode?.longitude}`, '_blank')}
                >
                  View on Map
                </Button>
              </p>
              <p>
                <i className="fas fa-star text-warning me-2"></i>
                {hotel.reviews?.rating !== -1 ? `${hotel.reviews?.rating} stars` : 'No rating available'} ({hotel.reviews?.count || 0} reviews)
              </p>
              <p>
                <i className="fas fa-phone text-success me-2"></i>
                {hotel.telephone || 'Phone not available'}
              </p>
              <p>
                <i className="fas fa-tag text-info me-2"></i>
                {hotel.price1 ? `Price: ${hotel.price1}` : 'Price on request'}
              </p>
            </Col>
          </Row>

          {!priceComparison && (
            <Button variant="primary" onClick={handleGetPriceComparison} className="mb-4">
              Get Price Comparison
            </Button>
          )}

          {priceComparison && (
            <>
              <h2 className="mb-4">Price Comparison</h2>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Price</th>
                    <th>Tax</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {priceComparison.map((item, index) => (
                    <tr key={index}>
                      <td>{item[`vendor${index + 1}`] || 'N/A'}</td>
                      <td>{item[`price${index + 1}`] || 'N/A'}</td>
                      <td>{item[`tax${index + 1}`] || 'N/A'}</td>
                      <td className="text-primary fw-bold">{item[`Totalprice${index + 1}`] || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          <Button variant="primary" className="mt-4">
            Book Now
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HotelDetails;

