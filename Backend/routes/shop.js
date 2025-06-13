const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/order");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();


const razorpay = new Razorpay({
    key_id: "your_key_id",
    key_secret: "your_key_secret",
  });
  
  // Create a new order


// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a product (Admin Only)
router.post("/products", async (req, res) => {
  try {
    const { name, description, price, image, stock } = req.body;
    const newProduct = new Product({ name, description, price, image, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post("/orders", async (req, res) => {
  try {
    const { email, items, totalAmount, address } = req.body;

    if (!email || !items || !totalAmount || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new order in MongoDB (Pending payment)
    const newOrder = new Order({
      email,
      items,
      totalAmount,
      address,
      paymentStatus: "pending",
    });

    await newOrder.save();

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: "INR",
      receipt: newOrder._id.toString(),
      payment_capture: 1,
    });

    // Store Razorpay order ID in MongoDB
    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    res.json({ order: newOrder, razorpayOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error while creating order" });
  }
});

// ✅ **Verify Razorpay Payment**
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find order in database
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // **Verify the Razorpay Signature**
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order status in the database
    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.json({ message: "Payment successful", order });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Server error during payment verification" });
  }
});

// 🛒 **Get All Orders (For Admin)**
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
});
//Get orders for email
router.get("/orders/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ email }).sort({ createdAt: -1 }); // Get orders by email
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
