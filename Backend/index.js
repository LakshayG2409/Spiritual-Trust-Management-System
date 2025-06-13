const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require('razorpay');
const crypto = require("crypto");
const User = require("./models/User");


require("dotenv").config();
require("dotenv").config();
const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows cookies or auth tokens if needed
  })
);






const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const shoppingroutes =require("./routes/shop")
const chatRoutes = require("./routes/chatroutes");
const yogaRoutes = require("./routes/yoga");


// Enable CORS for frontend (localhost:3000)


// Parse JSON requests
app.use(express.json());

//routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/shop", shoppingroutes);
app.use("/chat", chatRoutes);
app.use("/yoga", yogaRoutes);



mongoose
  .connect("mongodb+srv://guptalakshay517:9654878900@cluster0.tydc8.mongodb.net/SpiritualTrust")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.send("Express app is running on");
});

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },       
  timeSlot: { type: String, required: true },   
  status: { type: String, default: "pending" }  
});

const VolunteerRequest = mongoose.model("VolunteerRequest", VolunteerSchema);
app.post("/volunteer/requests", async (req, res) => {
  try {
    const { name, email, phone, message, date, timeSlot } = req.body;

    if (!name || !email || !phone || !message || !date || !timeSlot) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newRequest = new VolunteerRequest({ name, email, phone, message, date, timeSlot });
    await newRequest.save();
    
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting request" });
  }
});

// ✅ Admin updates volunteer request status (Twilio SMS Alert)
app.put("/volunteer/respond/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const request = await VolunteerRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Send SMS notification via Twilio
    const smsMessage =
      status === "approved"
        ? `Hello ${request.name}, your volunteer request has been approved!`
        : `Hello ${request.name}, unfortunately, your volunteer request has been rejected.`;

    await twilioClient.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+919654878900",
    });

    res.json({ message: "Request updated and SMS sent successfully" });
  } catch (error) {
    console.error(error);  // Log the error
    res.status(500).json({ error: "Error updating request" });
  }
});


// ✅ Get all volunteer requests
app.get("/volunteer/requests", async (req, res) => {
  try {
    const requests = await VolunteerRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching requests" });
  }
});

// ✅ Get specific volunteer requests by email
app.get("/volunteer/user-requests/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await VolunteerRequest.find({ email });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user requests" });
  }
});


//Donation////
/////
/////

const DonationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  transactionId: { type: String },
  paymentId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", DonationSchema);

// ✅ 3. Razorpay Setup
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret:", process.env.RAZORPAY_SECRET ? "Loaded" : "Not Loaded");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});


// ✅ 4. Create Payment Order
app.post("/donation/create-order", async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!email || !amount) {
      return res.status(400).json({ error: "Email and amount are required" });
    }

    console.log("Creating Razorpay Order:", { email, amount });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert INR to paise
      currency: "INR",
      payment_capture: 1,
    });

    console.log("Order Created:", order);

    const newDonation = new Donation({
      email,
      amount,
      paymentMethod: "Razorpay",
      status: "pending",
      transactionId: order.id, // Store Razorpay Order ID
    });

    await newDonation.save();
    res.status(201).json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order", details: error.message });
  }
});


app.post("/donation/verify-payment", async (req, res) => {
  try {
    console.log("Received Payment Verification Request:", req.body);
    const { orderId, paymentId, status, signature } = req.body;

    if (!orderId || !paymentId || !status || !signature) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Verify Signature (Security Check)
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // ✅ Find the donation and update it
    const donation = await Donation.findOne({ transactionId: orderId });
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    donation.status = status === "success" ? "success" : "failed";
    donation.paymentId = paymentId; // ✅ Store paymentId
    await donation.save();

    console.log("✅ Payment Verified & Updated:", donation);
    res.json({ message: "Payment status updated", donation });
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ error: "Error verifying payment" });
  }
});



// ✅ 6. Fetch User Donation History
app.get("/donation/history/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const donations = await Donation.find({ email }).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching donation history" });
  }
});

// ✅ 7. Fetch All Donations (Admin)
app.get("/donation/all", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all donations" });
  }
});


app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port " + port);
  } else {
    console.log("Error: " + error);
  }
});
