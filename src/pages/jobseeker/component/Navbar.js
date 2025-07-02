import React from "react";
import { Link } from "react-router-dom";
import "../../../Components/Navbar.css";
// import Logo from '../img/image.png';
// import LogoutButton from "../../../components/Logout";

const Navbar = () => {
  return (
    <nav className="navbar z-index-10">
      <div className="logo">
        <img
          // src={Logo}
          alt="CareerArcade Logo" className="logo-img" />
        <span className="company-name">CareerArcade</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/jobseeker-dashboard">Dashboard</Link></li>
        <li><Link to="/jobseeker-Search-Jobs">Search for Jobs</Link></li>
        <li><Link to="/jobseeker-applications">My Applications</Link></li>
        <li className="auth-buttons"><Link to="/">Log Out</Link></li>

      </ul>
      <div className="auth-buttons">
        {/* <LogoutButton /> */}
      </div>
    </nav>
  );
};

export default Navbar;
