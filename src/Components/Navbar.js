import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from '../img/image.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img 
        src={Logo} 
        alt="CareerArcade Logo" className="logo-img" />
        <span className="company-name">Workify</span>
      </div>
      <ul className="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><Link to="/jobseeker/jobs">Jobs</Link></li>
        <li><a href="#company">Companies</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
