import React, { useEffect, useState } from "react";
import Brief from "../Components/Brief/Brief";
import Footer from "../Components/Footer/Footer";
import "./CSS/Home.css"; // Import the CSS file
import Chatbot from "./Chatbot";

const Home = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className="brief-section">
          <Brief className="brief-content" />
        </div>
      </div>
      <Chatbot/>

      <Footer className="footer-container" />
    </div>
  );
};

export default Home;
