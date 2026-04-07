const express = require("express");
const router = express.Router();   
const Feedback = require("../models/feedback");
const db = require("../config/firebase");
router.post("/feedback", async (req, res) => {
  const { treatment, rating, comment } = req.body;

  if (!treatment || !rating) {
    return res
      .status(400)
      .json({ msg: "Treatment received and rating are required" });
  }

  try {
    await db.collection("feedback").add({
      treatment,
      rating,
      comment,
      createdAt: new Date()
    });

    res.status(201).json({ msg: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error submitting feedback", error: err.message });
  }
});

module.exports = router;