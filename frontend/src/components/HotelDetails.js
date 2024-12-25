import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { getHotelDetails } from '../utils/api';

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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </Container>
  );

  if (!hotel) return (
    <Container className="mt-5">
      <p className="text-center text-muted">No hotel details found.</p>
    </Container>
  );

  // Filter out vendors with no prices
  const validPrices = hotel.comparison[0].filter((item, index) => (
    item[`price${index + 1}`] && item[`price${index + 1}`] !== 'N/A'
  ));

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
                {hotel.reviews?.rating || 'N/A'} ({hotel.reviews?.count || 0} reviews)
              </p>
              <p>
                <i className="fas fa-phone text-success me-2"></i>
                {hotel.telephone || 'Phone not available'}
              </p>
            </Col>
          </Row>

          <h2 className="mb-4">Price Comparison</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Tax</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {validPrices.map((item, index) => (
                  <tr key={index}>
                    <td>{item[`vendor${index + 1}`]}</td>
                    <td>${item[`price${index + 1}`]}</td>
                    <td>${item[`tax${index + 1}`]}</td>
                    <td className="text-primary fw-bold">${item[`Totalprice${index + 1}`]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button variant="primary" className="mt-4">
            Book Now
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HotelDetails;

