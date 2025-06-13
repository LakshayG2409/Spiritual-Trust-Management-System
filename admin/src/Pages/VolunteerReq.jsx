import { useEffect, useState } from "react";
import './CSS/VolunteerReq.css';

const VolunteerReq = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/volunteer/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  const handleResponse = async (id, status) => {
    await fetch(`http://localhost:4000/volunteer/respond/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests(requests.map(req => req._id === id ? { ...req, status } : req));
  };

  return (
    <div className="admin-volunteer-container">
      <h2>Volunteer Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th> {/* Display Phone Column */}
            <th>Message</th>
            <th>Date</th> {/* Display Date Column */}
            <th>Time Slot</th> {/* Display Time Slot Column */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.name}</td>
              <td>{req.email}</td>
              <td>{req.phone}</td> {/* Display Phone Number */}
              <td>{req.message}</td>
              <td>{req.date}</td> {/* Display Date */}
              <td>{req.timeSlot}</td> {/* Display Time Slot */}
              <td>{req.status}</td>
              <td>
                {req.status === "pending" && (
                  <>
                    <button onClick={() => handleResponse(req._id, "approved")}>
                      Approve
                    </button>
                    <button onClick={() => handleResponse(req._id, "rejected")}>
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VolunteerReq;
