import { useEffect, useState } from "react";
import "./CSS/DonationHistory.css"; // Ensure you create a separate CSS file

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/donation/all")
      .then((res) => res.json())
      .then((data) => {
        setDonations(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donations:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-donations-container">
      <h2>Donation History</h2>
      {loading ? (
        <p>Loading donations...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Amount (INR)</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.email || "N/A"}</td>
                <td>₹{donation.amount}</td>
                <td>{donation.paymentMethod}</td>
                <td className={`status ${donation.status.toLowerCase()}`}>
                  {donation.status}
                </td>
                <td>{donation.transactionId || "N/A"}</td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDonations;
