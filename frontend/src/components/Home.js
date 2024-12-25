import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

// List of background images
const BACKGROUND_IMAGES = [
  '/tun3.jpg',
  '/tub.jpg',
  '/tub.png',
  '/tun.jpg',
  '/tun1.jpg',
  '/tun4.jpg',
  '/tun5.png',
  '/tun6.jpg',
  '/tun7.jpg',
  '/tun8.jpg',
  '/tun9.jpg',
  '/tun10.jpg',
  '/tun11.jpg',
];

const TUNISIAN_GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja",
  "Jendouba", "Kef", "Siliana", "Kairouan", "Kasserine", "Sidi Bouzid", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Gafsa", "Tozeur", "Kebili", "Gabès", "Medenine", "Tataouine"
];

function Home() {
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [currentBackground, setCurrentBackground] = useState(0);
  const [opacity, setOpacity] = useState(1);  // For fading background image on scroll
  const navigate = useNavigate();

  // Preload all background images
  useEffect(() => {
    const preloadImages = () => {
      BACKGROUND_IMAGES.forEach((image) => {
        const img = new Image();
        img.src = image;
      });
    };
    preloadImages();

    let index = 0;
    const interval = setInterval(() => {
      setCurrentBackground((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, 5000);

    // Scroll event listener to fade out background image
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeOutThreshold = 300; // Change this threshold value as needed
      const newOpacity = Math.max(1 - scrollY / fadeOutThreshold, 0);  // Gradually decrease opacity
      setOpacity(newOpacity);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGovernorateChange = (event) => {
    setSelectedGovernorate(event.target.value);
  };

  const handleSearch = () => {
    if (selectedGovernorate) {
      navigate(`/search?governorate=${encodeURIComponent(selectedGovernorate)}`);
    } else {
      alert("Please select a governorate before searching.");
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section text-center text-white py-5 mb-5" style={{ opacity: opacity }}>
        <Container>
          <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeIn">Find Your Perfect Stay in Tunisia</h1>
          <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-1s">Discover the best hotels across Tunisia's beautiful governorates</p>
          <Button 
            variant="primary" 
            size="lg" 
            className="animate__animated animate__fadeIn animate__delay-2s"
            onClick={() => document.getElementById('search-section').scrollIntoView({ behavior: 'smooth' })}
            aria-label="Explore hotels in Tunisia"
          >
            Explore Now
          </Button>
        </Container>

        {/* Background Images with Smooth Fade Transition */}
        <div className="background-images">
          {BACKGROUND_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`background-image ${index === currentBackground ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      </div>

      {/* Search Section */}
      <Container id="search-section" className="mb-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Body>
                <h2 className="text-center mb-4">Find Your Perfect Hotel</h2>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Select a Governorate</Form.Label>
                    <Form.Select 
                      value={selectedGovernorate} 
                      onChange={handleGovernorateChange}
                      aria-label="Select a governorate"
                    >
                      <option value="">Choose a governorate...</option>
                      {TUNISIAN_GOVERNORATES.map((governorate) => (
                        <option key={governorate} value={governorate}>
                          {governorate}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleSearch}
                      disabled={!selectedGovernorate}
                      aria-label="Search hotels in the selected governorate"
                    >
                      <i className="fas fa-search me-2"></i>
                      Search Hotels
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Feature Section */}
      <Container className="mb-5">
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow feature-card">
              <Card.Body className="text-center">
                <i className="fas fa-building fa-3x text-primary mb-3"></i>
                <Card.Title>Wide Selection</Card.Title>
                <Card.Text>Browse through hundreds of hotels across Tunisia</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow feature-card">
              <Card.Body className="text-center">
                <i className="fas fa-star fa-3x text-warning mb-3"></i>
                <Card.Title>Best Prices</Card.Title>
                <Card.Text>Compare prices from multiple booking platforms</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow feature-card">
              <Card.Body className="text-center">
                <i className="fas fa-map-marker-alt fa-3x text-success mb-3"></i>
                <Card.Title>Perfect Location</Card.Title>
                <Card.Text>Find hotels in your preferred governorate</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
