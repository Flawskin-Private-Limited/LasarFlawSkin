const router = require("express").Router();
const Contact = require("../models/getInTouch");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const db = require("../config/firebase");
router.post("/", async (req, res) => {
  await db.collection("contact").add({
    ...req.body,
    createdAt: new Date()
  });
  res.json({ msg: "Message sent successfully" });
  console.log(`New contact message from ${req.body.email}`);
});

module.exports = router;
