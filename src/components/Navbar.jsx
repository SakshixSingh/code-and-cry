import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const AppNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow mb-4">
      <Container>
        <Navbar.Brand onClick={() => navigate('/feed')} style={{ cursor: 'pointer' }}>
          💻 Code & Cry
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate('/feed')}>Feed</Nav.Link>
            <Nav.Link onClick={() => navigate('/post')}>Post</Nav.Link>
            <Nav.Link onClick={() => navigate('/profile')}>Profile</Nav.Link>
            <Button variant="outline-light" className="ms-3" onClick={handleLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
