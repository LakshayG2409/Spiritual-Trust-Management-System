import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar/Sidebar";
import "./CSS/AdminPanel.css";
import admin2 from "../Components/Assets/admin2.avif";

const AdminPanel = ({ setAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    navigate("/admin");
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <img src={admin2} alt="Admin" className="admin-pic" />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="content">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="main-content">
            <img src={admin2} alt=""/>
          <h1>Welcome to the Admin Panel</h1>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
