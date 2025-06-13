import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      window.open("http://localhost:3001", "_blank"); // Open in new tab
      navigate("/"); // Stay on the main site
    } else {
      navigate("/"); // Redirect non-admins to home
    }
  }, [navigate]);

  return <h2>Opening Admin Panel...</h2>;
};

export default AdminRedirect;
