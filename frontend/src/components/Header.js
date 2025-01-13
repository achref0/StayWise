import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Form, FormControl } from 'react-bootstrap';

function Header() {
  const [showSearchBox, setShowSearchBox] = useState(false);

  const handleSearchClick = () => {
    setShowSearchBox(!showSearchBox);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-0 custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <img 
            src='/favicon.ico.png' 
            alt="StayWise Logo" 
            style={{ width: '60px', height: '60px', marginRight: '10px' }} 
          />
          staywise
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ fontFamily: 'Poppins, sans-serif' }}>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <i className="fas fa-home me-2"></i>Home
            </Nav.Link>
            {!showSearchBox ? (
              <Nav.Link onClick={handleSearchClick} className="d-flex align-items-center">
                <i className="fas fa-search me-2"></i>Search
              </Nav.Link>
            ) : (
              <Form inline className="d-flex">
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="me-2 search-input"
                  autoFocus
                />
                <button onClick={handleSearchClick} className="btn btn-outline-light" type="button">X</button>
              </Form>
            )}
            <Nav.Link as={Link} to="/account" className="d-flex align-items-center">
              <i className="fas fa-user me-2"></i>Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
