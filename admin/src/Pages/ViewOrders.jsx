import React, { useState, useEffect } from "react";
import "./CSS/ViewOrders.css"

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:4000/shop/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2>Order History & Management</h2>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>
            <p>Email: {order.email}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>Address: {order.address}</p>
            <p>Payment Status: {order.paymentStatus}</p>
            <div>
              <h4>Items:</h4>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <img src={item.image} alt={item.name} width="50" />
                  <span>
                    {item.name} (x{item.quantity}) - ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default AdminManageOrders;
