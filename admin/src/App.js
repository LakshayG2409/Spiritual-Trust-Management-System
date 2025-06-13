import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLogin from "./Pages/Login";
import AdminPanel from "./Pages/AdminPanel";
import VolunteerReq from "./Pages/VolunteerReq"
import AdminDonations from "./Pages/DonationHistory";
import AdminEventMgt from "./Pages/AdminEventMgt";
import AdminAddProduct from "./Pages/AddProducts";
import AdminManageOrders from "./Pages/ViewOrders";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth); // ✅ Detects changes in localStorage

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" />} />
        <Route path="/admin" element={isAuthenticated ? <Navigate to="/admin-panel" /> : <AdminLogin setAuth={setIsAuthenticated} />} />
        <Route path="/admin-panel" element={isAuthenticated ? <AdminPanel setAuth={setIsAuthenticated} /> : <Navigate to="/admin" />} />
        <Route path ="/volunteer-request" element={<VolunteerReq/>}/>
        <Route path ="/donate-history" element={<AdminDonations/>}/>
        <Route path="/shop" element={<AdminAddProduct />} />
        <Route path="/order" element={<AdminManageOrders />} />
        <Route path="/event-mgt" element={<AdminEventMgt/>}/>
      </Routes>
    </Router>
  );
}

export default App;
