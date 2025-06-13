import React, { useEffect, useState } from "react";
import { getOrdersByEmail } from "../../Context/shopcontext";
import "./Orders.css";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email) {
          console.log("✅ User Email Found:", parsedUser.email);
          setUserEmail(parsedUser.email);
        } else {
          console.warn("⚠ No email found in stored user data.");
        }
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
      }
    } else {
      console.warn("⚠ No user data found in localStorage.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userOrders = await getOrdersByEmail(userEmail);
        console.log("📌 Received Orders:", userOrders);
        setOrders(userOrders);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order._id}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p className={`status ${order.status ? order.status.toLowerCase() : "processing"}`}>
                <strong>Status:</strong> {order.status || "Processing"}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
