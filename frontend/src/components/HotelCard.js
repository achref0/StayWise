import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

function HotelCard({ hotel }) {
  return (
    <Card className="h-100 shadow-sm hotel-card">
      <Card.Img variant="top" src="/placeholder.svg?height=200&width=400" alt={hotel.name} />
      <Card.Body>
        <Card.Title>{hotel.name}</Card.Title>
        <Card.Text>
          <i className="fas fa-star text-warning me-2"></i>
          {hotel.reviews.rating} ({hotel.reviews.count} reviews)
        </Card.Text>
        <Card.Text>
          <i className="fas fa-phone me-2"></i>
          {hotel.telephone}
        </Card.Text>
        <Card.Text className="fw-bold text-primary">
          {hotel.price1 ? `$${hotel.price1}` : 'Price on request'}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="bg-white border-top-0">
        <Button 
          as={Link} 
          to={`/hotel/${hotel.hotelId}`} 
          variant="outline-primary" 
          className="w-100"
        >
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
}

export default HotelCard;

