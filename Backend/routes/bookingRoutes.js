const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const router = express.Router();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ✅ Book Event (With Payment)
router.post("/book", async (req, res) => {
  try {
    const { email, eventId } = req.body;
    if (!email || !eventId) {
      return res.status(400).json({ error: "Email and eventId are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.fee > 0) {
      const order = await razorpay.orders.create({
        amount: event.fee * 100, // Amount in paise
        currency: "INR",
        payment_capture: 1,
      });

      const newBooking = new Booking({
        email,
        eventId,
        transactionId: order.id, // Store Razorpay Order ID
        paymentStatus: "pending",
      });

      await newBooking.save();
      res.status(201).json({ orderId: order.id });
    } else {
      const newBooking = new Booking({
        email,
        eventId,
        paymentStatus: "success",
      });

      await newBooking.save();
      res.status(201).json({ message: "Event booked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error booking event" });
  }
});

// ✅ Verify Payment
router.post("/verify-payment", async (req, res) => {
  try {
    console.log("Received Payment Verification Request:", req.body);
    const { orderId, paymentId, status, signature } = req.body;

    if (!orderId || !paymentId || !status || !signature) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // ✅ Find the booking and update it
    const booking = await Booking.findOne({ transactionId: orderId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.paymentStatus = status === "success" ? "success" : "failed";
    booking.paymentId = paymentId; // ✅ Store Razorpay Payment ID
    await booking.save();

    console.log("✅ Payment Verified & Updated:", booking);
    res.json({ message: "Payment status updated", booking });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ error: "Error verifying payment" });
  }
});

// ✅ Get Booking History by Email
router.get("/history/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const bookings = await Booking.find({ email }).populate("eventId", "title date time location fee");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching booking history" });
  }
});

// ✅ Admin - Get All Bookings
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("eventId", "title date time location fee").select("email paymentStatus transactionId paymentId createdAt");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all bookings" });
  }
});

module.exports = router;
