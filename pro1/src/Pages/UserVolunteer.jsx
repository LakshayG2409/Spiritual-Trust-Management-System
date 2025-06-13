import { useState, useEffect } from "react";
import "./CSS/UserVolunteer.css";

const UserVolunteer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Assuming email is set elsewhere (e.g., from a logged-in user context)
  const [phone, setPhone] = useState(""); // Add phone number state
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [userRequests, setUserRequests] = useState([]); // Store fetched user requests

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
  ];

  useEffect(() => {
    // Generate next 4 days dynamically
    const generateNextDays = () => {
      let dates = [];
      for (let i = 1; i <= 4; i++) {
        let nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + i);
        let formattedDate = nextDate.toISOString().split("T")[0]; // YYYY-MM-DD format
        dates.push(formattedDate);
      }
      setAvailableDates(dates);
    };

    generateNextDays();
  }, []);

  useEffect(() => {
    // Fetch user volunteer requests using email (only if email is set)
    if (email) {
      const fetchUserRequests = async () => {
        try {
          const response = await fetch(`http://localhost:4000/volunteer/user-requests/${email}`);
          const data = await response.json();
          setUserRequests(data);
        } catch (error) {
          console.error("Error fetching user requests:", error);
        }
      };

      fetchUserRequests();
    }
  }, [email]); // Re-run this effect when the email changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/volunteer/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, date, timeSlot, message }), // Include phone
    });
    const data = await response.json();
    if (data.message) {
      setSuccess(true);
      setName("");
      setEmail(""); // Reset email field (optional)
      setPhone(""); // Reset phone field
      setDate("");
      setTimeSlot("");
      setMessage("");
    }
  };

  return (
    <div className="volunteer-container">
      <h2>Volunteer Request</h2>
      {success && <p className="success">Request submitted successfully!</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)} // Handle phone number input
          required
        />
        <select value={date} onChange={(e) => setDate(e.target.value)} required>
          <option value="">Select a Date</option>
          {availableDates.map((d, index) => (
            <option key={index} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
          <option value="">Select a Time Slot</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Why do you want to volunteer?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit Request</button>
      </form>

      <div className="user-requests">
        <h3>Your Previous Volunteer Requests</h3>
        {userRequests.length > 0 ? (
          <ul>
            {userRequests.map((request, index) => (
              <li key={index}>
                <p><strong>Date:</strong> {request.date}</p>
                <p><strong>Time Slot:</strong> {request.timeSlot}</p>
                <p><strong>Message:</strong> {request.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous requests found.</p>
        )}
      </div>
    </div>
  );
};

export default UserVolunteer;
