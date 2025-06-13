import { useState, useEffect } from "react";
import "./CSS/Activity.css";

const ActivityPage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userEmail = storedUser?.email || "";

  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donationError, setDonationError] = useState("");

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    // Fetch Donation Details
    fetch(`http://localhost:4000/volunteer/user-requests/${userEmail}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch volunteer requests.");
      return res.json();
    })
    .then((data) => setRequests(data))
    .catch(() => setError("Failed to load volunteer activity."))
    .finally(() => setLoading(false));

  // Fetch Donation History (Fixed Endpoint)
  fetch(`http://localhost:4000/donation/history/${userEmail}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch donations.");
      return res.json();
    })
    .then((data) => setDonations(data))
    .catch(() => setDonationError("Failed to load donation history."));
}, [userEmail]);

  return (
    <div className="activity-container">
      <h1>Activity Status</h1>

      {loading ? (
        <p>Loading your activity...</p>
      ) : (
        <div className="activity-columns">
          {/* Volunteer Requests Section */}
          <div className="activity-section">
            <h2>Your Volunteer Activity</h2>
            {error ? (
              <p className="error-message">{error}</p>
            ) : requests.length === 0 ? (
              <p>You haven’t made any volunteer requests yet.</p>
            ) : (
              <ul className="request-list">
                {requests.map((req) => (
                  <li key={req._id} className="request-item">
                    <strong>Date:</strong> {req.date} <br />
                    <strong>Time Slot:</strong> {req.timeSlot} <br />
                    <strong>Status:</strong>{" "}
                    <span className={`status ${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>{" "}
                    <br />
                    {req.response && (
                      <>
                        <strong>Response:</strong> {req.response}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Donations Section */}
          <div className="activity-section">
            <h2>Your Donations</h2>
            {donationError ? (
              <p className="error-message">{donationError}</p>
            ) : donations.length === 0 ? (
              <p>You haven’t made any donations yet.</p>
            ) : (
              <ul className="donation-list">
                {donations.map((donation) => (
                  <li key={donation._id} className="donation-item">
                    <strong>Amount:</strong> ₹{donation.amount} <br />
                    <strong>Date:</strong> {donation.createdAt} <br />
                    <strong>Transaction ID:</strong> {donation.transactionId} <br />
                    <strong>Status:</strong>{" "}
                    <span className={`status ${donation.status.toLowerCase()}`}>
                      {donation.status}
                    </span>{" "}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
