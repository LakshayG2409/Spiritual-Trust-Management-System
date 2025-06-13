import { useState, useEffect } from "react";
import "./CSS/AdminEventMgt.css";

const AdminEventMgt = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [imgErrors, setImgErrors] = useState({}); // Track image errors

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    fee: "",
    image: null,
  });

  // Fetch events & bookings
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:4000/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:4000/bookings/all");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
  }, []);

  // Handle Image Upload
  const handleImageChange = (e) => {
    setNewEvent({ ...newEvent, image: e.target.files[0] });
  };

  // Handle event creation
  const handleCreateEvent = async () => {
    const formData = new FormData();
    Object.keys(newEvent).forEach((key) => formData.append(key, newEvent[key]));

    try {
      const response = await fetch("http://localhost:4000/events/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Event created successfully!");
        fetchEvents();
        setNewEvent({ title: "", description: "", date: "", time: "", location: "", fee: "", image: null });
      } else {
        alert("Error creating event.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`http://localhost:4000/events/delete/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Event deleted successfully!");
        fetchEvents();
      } else {
        alert("Error deleting event.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Track image load errors
  const handleImageError = (eventId) => {
    setImgErrors((prev) => ({ ...prev, [eventId]: true }));
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel - Event Management</h2>

      {/* Create Event Form */}
      <div className="create-event">
        <h3>Create New Event</h3>
        <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
        <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
        <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
        <input type="text" placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
        <textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>
        <input type="number" placeholder="Fee (₹)" value={newEvent.fee} onChange={(e) => setNewEvent({ ...newEvent, fee: e.target.value })} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleCreateEvent}>Create Event</button>
      </div>

      {/* Event List */}
      <div className="event-list">
        <h3>Existing Events</h3>
        <div className="event-grid">
          {events.map((event) => (
           <div className="event-card" key={event._id}>
           <div className="event-details">
             <h3>{event.title}</h3>
             <p>{event.description}</p>
             <p>Date: {event.date} | Time: {event.time}</p>
             <p>Location: {event.location}</p>
             <p>Fee: {event.fee > 0 ? `₹${event.fee}` : "Free"}</p>
             <button className="delete-btn" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
           </div>
         
           <img 
             src={event.image ? event.image : "/default-event.jpg"} 
             alt={event.title} 
             className="event-image" 
             onError={(e) => e.target.src = "/default-event.jpg"} 
           />
         </div>
         
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="booking-list">
        <h3>Bookings</h3>
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <p>User: {booking.email}</p>
            <p>Event: {booking.eventId ? booking.eventId.title : "Event not found"}</p>
            <p>Status: {booking.paymentStatus}</p>
            <p>Transaction ID: {booking.transactionId || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEventMgt;
