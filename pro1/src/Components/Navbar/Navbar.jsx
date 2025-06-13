import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../Assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navlogo">
        <img src={logo} alt="Logo" />
        <p>YInYang</p>
      </div>

      <ul className="lists">
        <li>
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li>
          <Link to="/volunteer" className="nav-link">Volunteer</Link>
        </li>
        <li>
          <Link to="/yoga" className="nav-link">Yoga And Meditation</Link>
        </li>
        <li>
          <Link to="/shop" className="nav-link">Shop</Link>
        </li>
        
        <li>
  <Link
    to={isLoggedIn ? "/events" : "/login"}
    className="nav-link"
    onClick={(e) => {
      if (!isLoggedIn) {
        e.preventDefault(); // Prevent navigation to the Donate page
        navigate("/login"); // Redirect to login page
      }
    }}
  >
    Events
  </Link>
</li>
        <li>
  <Link
    to={isLoggedIn ? "/donate" : "/login"}
    className="nav-link"
    onClick={(e) => {
      if (!isLoggedIn) {
        e.preventDefault(); // Prevent navigation to the Donate page
        navigate("/login"); // Redirect to login page
      }
    }}
  >
    Donate
  </Link>
</li>
<li>
  <Link
    to={isLoggedIn ? "/cart" : "/login"}
    className="nav-link"
    onClick={(e) => {
      if (!isLoggedIn) {
        e.preventDefault(); // Prevent navigation to the Donate page
        navigate("/login"); // Redirect to login page
      }
    }}
  >
  Cart
  </Link>
</li>


        {/* User Dropdown (Only when logged in) */}
        {isLoggedIn && (
          <li className="dropdown">
            <button 
              className="nav-user-icon" 
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUserCircle size={24} />
            </button>
            
            {showDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/activity" className="nav-link">My Activity</Link>
                </li>
                <li>
                  <Link to="/mybookings" className="nav-link">My Bookings</Link>
                </li>
                <li>
                  <Link to="/orders" className="nav-link">My Orders</Link>
                </li>
                <li>
                  <button className="nav-button" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            )}
          </li>
        )}

        {!isLoggedIn && (
          <li>
            <Link to="/login">
              <button className="nav-button">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
