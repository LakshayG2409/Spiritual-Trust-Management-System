const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Order = require("../models/order");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Predefined FAQs
const faqs = {
  "What are your services?": "We offer puja bookings, donations, volunteering, and a mini-shop.",
  "How can I volunteer?": "You can apply for volunteering on our website under the 'Volunteer' section.",
  "What type of Volunteership u provide":"We have Ashram Volunteership",
  "What is the donation process?": "You can donate via Razorpay on our platform.",
};

// Store user emails temporarily
const userSessions = {}; 

// Chat API Route
router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // If user has not provided an email, ask for it
    if (!userSessions[req.ip]) {
      return res.json({ message: "May I know your email address to assist you better?" });
    }

    const email = userSessions[req.ip];

    // Check FAQs first
    if (faqs[message]) {
      return res.json({ message: faqs[message] });
    }

    // Fetch user's last chat message
    const lastChat = await Chat.findOne({ email }).sort({ timestamp: -1 });
    let context = lastChat ? `User: ${lastChat.message}\nBot: ${lastChat.response}` : "";

    // Fetch Orders from MongoDB
    const orders = await Order.find({ email }).sort({ createdAt: -1 });

    let recentOrders = orders.slice(0, 3);
    let olderOrders = orders.slice(3);

    let orderMessage = `Okay, here's what I found for **${email}**:\n\n`;

    if (recentOrders.length > 0) {
      orderMessage += `* **Recent Orders:**\n`;
      recentOrders.forEach(order => {
        orderMessage += `  - Items: ${order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join(", ")} | Total: ₹${order.totalAmount} | Status: ${order.paymentStatus}\n`;
      });
    } else {
      orderMessage += "* **Recent Orders:** None found.\n";
    }

    if (olderOrders.length > 0) {
      orderMessage += `\n* **Older Orders:**\n`;
      olderOrders.forEach(order => {
        orderMessage += `  - Order ID: ${order._id} | Total: ₹${order.totalAmount} | Status: ${order.paymentStatus}\n`;
      });
    } else {
      orderMessage += "\n* **Older Orders:** None found.\n";
    }

    // Generate AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${context}\nUser: ${message}\nBot:`,
    });

    const botResponse = response.text || "I'm sorry, I couldn't generate a response.";

    // Save chat
    await Chat.create({ email, message, response: botResponse });

    // Send chatbot response
    res.json({ message: `${orderMessage}\n\n${botResponse}` });

  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Error generating response from AI" });
  }
});

// Store email for the session
router.post("/set-email", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  userSessions[req.ip] = email;
  res.json({ message: "Email saved! How can I help you today?" });
});

module.exports = router;
