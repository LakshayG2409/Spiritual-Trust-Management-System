import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import './CSS/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="content">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="main-content">
          {/* Add main content here */}
          <h1>Welcome to Home Page</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
