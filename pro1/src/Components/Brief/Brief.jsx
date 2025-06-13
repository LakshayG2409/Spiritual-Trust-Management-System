import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import home1 from "../Assets/home1.jpg";
import home2 from "../Assets/home2.jpg";
import home4 from "../Assets/home4.jpg";
import vol3 from "../Assets/vol3.jpg";
import donate1 from "../Assets/donate1.jpg";
import "./Brief.css";

const Brief = () => {
  const images = [home1, home2, home4];
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="brief-container">
      {/* Slideshow */}
      <div className="slideshow-container">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Slideshow"
            className={`slideshow ${index === currentImage ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Quote Section */}
      <div className="text-section">
        <p>“More smiling, less worrying. More compassion, less judgment. More blessed, less stressed. More love, less hate.”</p>
        <p>It is our ultimate digital solution for enriching your religious and spiritual experiences...</p>
      </div>

      {/* Contribution Section */}
      <div className="content-section">
        <div className="volunteer-section">
          <img src={vol3} alt="Volunteering" />
          <h1>Your Contribution</h1>
          <h4>Can change someone's life</h4>
          <p>YinYang is a volunteer-run organization that aims to bring physical, mental, and spiritual well-being for everyone...</p>
          <button className="btn" onClick={() => navigate("/volunteer")}>Volunteer</button>
        </div>

        <div className="donate-section">
          <img src={donate1} alt="Donate" />
          <h1>Donate for Society</h1>
          <h4>“Never before has Humanity been as empowered as we are today...”</h4>
          <button className="btn" onClick={() => navigate("/donate")}>Donate</button>
        </div>
      </div>
    </div>
  );
};

export default Brief;
