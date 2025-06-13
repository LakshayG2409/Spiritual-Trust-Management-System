const API_BASE_URL = "http://localhost:4000"; // Update with backend URL

// Fetch all products
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shop/products`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Create an order
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/shop/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

export const getOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/orders`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };
  export const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  };

  export const getOrdersByEmail = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/orders/${email}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }
  };
  
  