import React, { useState } from "react";
import "./CSS/AddProducts.css"; // Import CSS

const AdminAddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image, // Assuming image is provided as URL
    };

    try {
      const response = await fetch("http://localhost:4000/shop/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }
      await response.json();
      setMessage("Product added successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setStock(1);
      setImage("");
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Error adding product.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />

        <label>Image URL:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {message && <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>{message}</p>}
    </div>
  );
};

export default AdminAddProduct;
