const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Password strength validation function
const isStrongPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
  return strongPasswordRegex.test(password);
};

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (email === process.env.ADMIN_EMAIL) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Incorrect admin credentials" });
    }

    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new User({
      name: name || "Admin",
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });

    await admin.save();
    return res.json({ message: "Admin registered successfully" });
  }

  // Password strength check for regular users
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    });
  }

  if (role && role !== "user") {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const user = new User({ name, email, password, role: "user" });

  await user.save();
  res.json({ message: "User registered successfully" });
});


// Login Route (JWT-based authentication)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user;

  if (email === process.env.ADMIN_EMAIL) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }
    user = { _id: "admin", email: process.env.ADMIN_EMAIL, role: "admin" };
  } else {
    user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role, email: user.email });
});

// Middleware for role-based authentication
const authenticate = (role) => {
  return (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role)
        return res.status(403).json({ message: "Access denied" });

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Protected routes
router.get("/admin", authenticate("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

router.get("/user", authenticate("user"), (req, res) => {
  res.json({ message: "Welcome User!" });
});

module.exports = router;
