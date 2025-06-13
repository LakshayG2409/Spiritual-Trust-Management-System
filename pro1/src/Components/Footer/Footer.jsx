import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Logo & Info */}
        <div className="footer-left">
          <h2>YingYang</h2>
          <p>Empowering communities through selfless service.</p>
        </div>

        {/* Center Section - Links */}
        <div className="footer-center">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/volunteer">Volunteer</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </div>

        {/* Right Section - Social Media */}
        <div className="footer-right">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Spiritual Trust. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
