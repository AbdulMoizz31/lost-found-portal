// ThreeSectionNavbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Button,
  Container
} from 'reactstrap';
import { logoutUser } from '../../services/firebase';

const ThreeSectionNavbar = () => {
  const user = 'user'
  const navigate = useNavigate()
  return (
    <Navbar  light expand="md" className=" shadow-sm py-3">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <div className="fw-bold fs-4">UMT LOST/FOUND</div>

        {/* Center: Links */}
        <Nav className="d-none d-md-flex gap-4 mx-auto">
          <NavItem>
            <NavLink href="/home" className="text-dark fw-semibold">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/about" className="text-dark fw-semibold">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/claim-requests" className="text-dark fw-semibold">Claim Requests</NavLink>
          </NavItem>
        </Nav>
        {user? <button className="btn btn-success px-4" onClick={()=>logoutUser(navigate)}>Logout</button>:
         <Link to={'/login'}><button className="btn btn-success px-4">Login</button></Link>}
      </Container>
    </Navbar>
  );
};



 




export default ThreeSectionNavbar;
