import React, { useContext, useEffect, useState } from "react";
import { getProducts } from "../Context/shopcontext";
import { CartContext } from "../Context/cartcontext";
import './CSS/Mainshop.css'





const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);



  return (
    <div className="shop-page">
    <div className="shop-container">
      <h2>Shop</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="description">{product.description}</p>
            <p className="price">₹{product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
  
};

export default ShopPage;
