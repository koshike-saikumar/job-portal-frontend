import React from "react";
import { Link } from "react-router-dom";
import "../../../Components/Navbar.css";
// import Logo from '/img/image.png';
// import LogoutButton from "../../../components/Logout";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img
          // src={Logo}
          alt="CareerArcade Logo" className="logo-img" />
        <span className="company-name">CareerArcade</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/employe-dashboard">Dashboard</Link></li>
        <li><Link to="/employe-postjob">Post a Job</Link></li>
        <li className="auth-buttons"><Link to="/">Log Out</Link></li>

      </ul>
      <div className="auth-buttons">
        {/* <LogoutButton /> */}
      </div>
    </nav>
  );
};

export default Navbar;
