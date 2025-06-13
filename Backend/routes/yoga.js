const express = require("express");
const router = express.Router();
const Recommendation = require("../models/Recommendation");
const { getRecommendationFromAnswers } = require("../brain/recommendationModel");

// POST: Receive answers, return recommendation
router.post("/recommend", async (req, res) => {
  const { email, answers } = req.body;

  if (!email || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Email and answers array required" });
  }

  try {
    const {recommendation ,image} = getRecommendationFromAnswers(answers);
    if (!recommendation) {
      return res.status(500).json({ error: "Failed to generate recommendation" });
    }

    const saved = await Recommendation.create({
      email,
      answers,
      recommendation,
    });

    res.json({ recommendation,image });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Past recommendation by email
router.get("/history/:email", async (req, res) => {
  try {
    const history = await Recommendation.find({ email: req.params.email });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
