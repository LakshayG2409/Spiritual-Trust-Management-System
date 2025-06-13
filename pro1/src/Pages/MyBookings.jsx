import { useEffect, useState } from "react";
import "./CSS/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Retrieve email from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email) {
          setUserEmail(parsedUser.email);
        } else {
          console.warn("⚠ No email found in stored user data.");
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
        setLoading(false);
      }
    } else {
      console.warn("⚠ No user data found in localStorage.");
      setLoading(false);
    }
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (!userEmail) return;

    console.log("✅ Fetching bookings for:", userEmail);

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:4000/bookings/history/${userEmail}`);
        console.log("📢 API Response Status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        console.log("📌 Received Bookings:", data);
        setBookings(data);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userEmail]);

  if (loading) {
    return <p className="loading">Loading bookings...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h2 className="heading">My Bookings</h2>
  
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found.</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.eventId?.title || "N/A"}</td>
                  <td>{booking.eventId?.date || "N/A"}</td>
                  <td>{booking.eventId?.time || "N/A"}</td>
                  <td>{booking.eventId?.location || "N/A"}</td>
                  <td>₹{booking.eventId?.fee || 0}</td>
                  <td className={booking.paymentStatus === "success" ? "success" : "failed"}>
                    {booking.paymentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
  
};

export default MyBookings;
