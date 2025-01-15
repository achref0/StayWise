import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import LoginModal from './LoginModal';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <Nav.Link as={Link} to="/" className={isActive('/')}>
              <i className="fas fa-home me-2"></i>Home
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className={isActive('/search')}>
              <i className="fas fa-search me-2"></i>Search
            </Nav.Link>
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  <i className="fas fa-user me-2"></i>{user.username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/api-usage">API Usage</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/account-settings">Account Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button variant="outline-light" onClick={() => setShowLoginModal(true)}>
                <i className="fas fa-sign-in-alt me-2"></i>Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
    </Navbar>
  );
}

export default Header;

