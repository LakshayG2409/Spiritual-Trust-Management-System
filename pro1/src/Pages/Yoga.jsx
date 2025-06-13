import React, { useState } from "react";
import "./CSS/Yoga.css"; // Import the styles

const Yoga = () => {
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [recommendation, setRecommendation] = useState(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/yoga/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers }),
      });

      const data = await res.json();

      if (res.ok) {
        setRecommendation(data.recommendation);
        setImage(data.image); // Set the image from backend
        setError("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    }
  };

  return (
    <div className="yoga-container">
      <div className="yoga-form">
        <h1 className="text-2xl font-bold mb-4">Yoga & Meditation Recommendation</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <label className="block mb-1 font-medium">How are you feeling emotionally?</label>
            <select
              className="border p-2 w-full"
              value={answers[0]}
              onChange={(e) => handleAnswerChange(0, e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="stressed">Stressed</option>
              <option value="anxious">Anxious</option>
              <option value="happy">Happy</option>
              <option value="angry">Angry</option>
              <option value="sad">Sad</option>
              <option value="overwhelmed">Overwhelmed</option>
              <option value="calm">Calm</option>
              <option value="distracted">Distracted</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">How is your physical energy?</label>
            <select
              className="border p-2 w-full"
              value={answers[1]}
              onChange={(e) => handleAnswerChange(1, e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="tired">Tired</option>
              <option value="energetic">Energetic</option>
              <option value="low energy">Low Energy</option>
              <option value="sleepy">Sleepy</option>
              <option value="focused">Focused</option>
              <option value="sore">Sore</option>
              <option value="restless">Restless</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">How was your sleep last night?</label>
            <select
              className="border p-2 w-full"
              value={answers[2]}
              onChange={(e) => handleAnswerChange(2, e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="great">Great</option>
              <option value="okay">Okay</option>
              <option value="poor">Poor</option>
              <option value="tense">Tense</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Get Recommendation
          </button>
        </form>

        {error && <p className="error-message text-red-500 mt-4">{error}</p>}

        {recommendation && (
          <div className="recommendation mt-6 p-4 border rounded bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">Your Recommendation:</h3>
            <p className="mb-3">{recommendation}</p>
            {image && (
              <img
                src={image}
                alt={recommendation}
                className="w-full max-w-md h-auto rounded shadow"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Yoga;
