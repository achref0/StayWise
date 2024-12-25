import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-0 custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">StayWise</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className={isActive('/')}>
              <i className="fas fa-home me-2"></i>Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className={isActive('/search')}>
              <i className="fas fa-search me-2"></i>Search
            </Nav.Link>
            <Nav.Link as={Link} to="/account" className={isActive('/account')}>
              <i className="fas fa-user me-2"></i>Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
