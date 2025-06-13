import { useEffect, useState } from "react";
import "./CSS/EventBooking.css";

const EventBooking = ({ userEmail }) => {
  const [events, setEvents] = useState([]);
  const [bookingMessage, setBookingMessage] = useState("");
  const [email, setEmail] = useState(userEmail || "");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    fetchEvents();
    loadRazorpayScript(); // Load Razorpay dynamically
  }, []);

  // ✅ Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

  // ✅ Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:4000/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // ✅ Book an event (calls backend & initiates payment if required)
  const bookEvent = async (eventId, fee) => {
    if (!email) {
      setBookingMessage("Please enter your email to book an event.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, eventId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      if (fee > 0 && data.orderId) {
        handlePayment(data.orderId, eventId, fee);
      } else {
        setBookingMessage("Event booked successfully!");
      }
    } catch (error) {
      console.error("Error booking event:", error);
      setBookingMessage("Failed to book event. Please try again.");
    }
  };

  // ✅ Razorpay Payment Handler
  const handlePayment = (orderId, eventId, amount) => {
    if (!razorpayLoaded) {
      setBookingMessage("Payment gateway not loaded. Please try again.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: "INR",
      name: "Trust Event Booking",
      description: "Pooja Booking Payment",
      order_id: orderId,
      handler: async (response) => {
        try {
          const verifyResponse = await fetch("http://localhost:4000/bookings/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId,
              paymentId: response.razorpay_payment_id,
              status: "success",
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          setBookingMessage(verifyResponse.ok ? "Payment successful & event booked!" : "Payment verification failed.");
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      },
      prefill: { email },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="user-container">
      <h2>Book Your Pooja</h2>

      {/* Email Input */}
      <label>Email:</label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Enter your email" 
      />

      <p>{bookingMessage}</p>

      <div className="event-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <h3>{event.title}</h3>
            {event.image && <img src={event.image} alt={event.title} className="event-image" />}
            <p>{event.description}</p>

            <p>Date: {event.date} | Time: {event.time}</p>
            <p>Location: {event.location}</p>
            <p>Fee: {event.fee > 0 ? `₹${event.fee}` : "Free"}</p>
            <button onClick={() => bookEvent(event._id, event.fee)}>Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventBooking;
