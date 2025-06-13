import React, { useState, useContext } from "react";
import { createOrder, verifyPayment } from "../Context/shopcontext";
import { CartContext } from "../Context/cartcontext";
import './CSS/Checkout.css'; 

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    if (!email || !address) {
      alert("Please provide email and address");
      return;
    }

    setLoading(true);

    const orderData = {
      email,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      address,
    };

    try {
      console.log("Sending order data:", orderData);
      const { order, razorpayOrder } = await createOrder(orderData);

      if (!razorpayOrder || !razorpayOrder.amount) {
        throw new Error("Invalid Razorpay order details");
      }

      const options = {
        key: "rzp_test_hUEzYo60NLMeem",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Ying Yang",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.message === "Payment successful") {
              alert("Payment verified successfully!");
              clearCart();
              setPaymentSuccess(true);
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification error. Please contact support.");
          }
        },
        prefill: {
          email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="success-message">
        <h2>Thank You!</h2>
        <p>Your order has been placed successfully.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="checkout-form">
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label>Address:</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your shipping address"
            />
          </div>
          <h3 className="total-amount">Total: ₹{totalAmount}</h3>
          <button className="payment-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
