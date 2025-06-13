import React, { useContext } from "react";
import { CartContext } from "../Context/cartcontext";
import { Link } from "react-router-dom";
import './CSS/Maincart.css'

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      <p className="cart-subheading">Review your items before checkout</p>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>₹{item.price} x {item.quantity}</p>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
       <Link to="/checkout">
       <button className="checkout-btn">Proceed to Checkout</button>
     </Link>
      )}
    </div>
  );
};

export default Cart;
