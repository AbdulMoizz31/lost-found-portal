// ThreeSectionNavbar.js
import React from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Button,
  Container
} from 'reactstrap';

const ThreeSectionNavbar = () => {
  return (
    <Navbar  light expand="md" className=" shadow-sm py-3">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <div className="fw-bold fs-4">MyLogo</div>

        {/* Center: Links */}
        <Nav className="d-none d-md-flex gap-4 mx-auto">
          <NavItem>
            <NavLink href="/home" className="text-dark fw-semibold">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/about" className="text-dark fw-semibold">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/services" className="text-dark fw-semibold">Services</NavLink>
          </NavItem>
        </Nav>
        <button className="btn btn-success px-4">Login</button>
      </Container>
    </Navbar>
  );
};



 




export default ThreeSectionNavbar;
