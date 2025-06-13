import { useState, useEffect } from "react";
import "./CSS/Donation.css"; 

const Donate = () => {
  const [amount, setAmount] = useState(100);
  const [user, setUser] = useState({ name: "", email: "", contact: "" });

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay script loaded");
      document.body.appendChild(script);
    };
    loadRazorpayScript();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
        contact: storedUser.contact || "",
      });
    }
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!user.name || !user.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/donation/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, amount }),
      });

      const data = await response.json();
      if (!data.orderId) {
        alert("Failed to create order. Try again.");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        order_id: data.orderId,
        handler: (response) => {
          alert("Payment Successful!");
          verifyPayment(data.orderId, response.razorpay_payment_id, "success", response.razorpay_signature);
        },
        prefill: { name: user.name, email: user.email, contact: user.contact },
        theme: { color: "#3399cc" },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK failed to load. Check your internet connection.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error processing donation. Please try again.");
    }
  };

  const verifyPayment = async (orderId, paymentId, status, signature) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/donation/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentId, status, signature }),
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  return (
    <div className="donate-container">
      <div className="donate-box">
        <h2>Donate Now</h2>
        <form onSubmit={handleDonate}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />

          <label>Contact</label>
          <input
            type="text"
            placeholder="Enter your contact number"
            value={user.contact}
            onChange={(e) => setUser({ ...user, contact: e.target.value })}
          />

          <label>Amount (INR)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />

          <button type="submit">Donate</button>
        </form>
      </div>
    </div>
  );
};

export default Donate;
