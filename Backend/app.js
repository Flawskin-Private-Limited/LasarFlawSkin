require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const contactRoutes = require("./src/routes/getInTouch");
const authRoutes = require("./src/routes/auth");
const adminRoutes = require("./src/routes/admin");
const feedbackRoutes = require("./src/routes/feedback");

const ipRestriction = require("./src/middlewares/ipRestriction");

const app = express();

app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGIN.split(",");

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.set("trust proxy", true);

app.use((req, res, next) => {
  console.log("Client IP:", req.ip);
  next();
});

app.use("/contact", contactRoutes);
app.use("/auth", authRoutes);
app.use("/", feedbackRoutes);
app.use("/admin", adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
  });

module.exports = app;
