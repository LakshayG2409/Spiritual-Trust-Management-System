import React from "react";
import { useNavigate } from "react-router-dom";
import vol3 from "../Components/Assets/vol3.jpeg";
import ashram from "../Components/Assets/ashram.jpg";
import "./Volunteer.css";

const Volunteer = () => {
  const navigate = useNavigate();

  const handleVolunteerClick = () => {
    const token = localStorage.getItem("token"); // Check if user is logged in
    if (token) {
      navigate("/volunteer-request"); // Navigate to UserVolunteer page
    } else {
      alert("You must be logged in to request volunteering!");
      navigate("/login"); // Redirect to login page
    }
  };

  return (
    <div className="volunteer-container">
      {/* Section 1: Be a Volunteer */}
      <div className="vol1">
        <div className="vol1-text">
          <h1>Be a Volunteer</h1>
          <h4>Help in the betterment of society.</h4>
        </div>
        <img src={vol3} alt="Volunteer" />
      </div>

      {/* Section 2: Ashram Volunteering */}
      <div className="vol2">
        <img src={ashram} alt="Ashram Volunteering" />
        <h1>Ashram Volunteering</h1>
        <h5>
          Volunteering allows you to have a profound experience of the ashram.
          It brings a deep sense of involvement and serves as a powerful tool
          for inner transformation.
        </h5>
        <button onClick={handleVolunteerClick}>I Am Interested</button>
      </div>
    </div>
  );
};

export default Volunteer;
