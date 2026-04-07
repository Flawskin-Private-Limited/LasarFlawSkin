const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/users");
const authMiddleware = require("../middlewares/authMiddleware");
const generateOTP = require("../util/generateOTP");
const OTP = require("../models/otp");
const admin = require("firebase-admin");
const db = require("../config/firebase");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


router.post("/register", async (req, res) => {
  try {

    const { email, name, phone, password, gender, age } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All required fields must be filled" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      passwordHash
    });

    const timestamp = new Date();
    
    await db.collection("Auth")
      .doc(user._id.toString())   
      .set({
        fullName: name,
        email,
        phone: phone || "",
        gender: gender || "",
        age,
        image: gender === 'Male' ? '/men.png' : '/female.png',
        note: "",
        createdAt: timestamp,
        updatedAt: timestamp
      });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    const firebaseToken = await admin.auth().createCustomToken(user._id.toString(), {
      role: user.role || 'customer'
    });

    res.json({
      success: true,
      token,
      firebaseToken,
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ msg: "Server error" });

  }
});

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    const firebaseToken = await admin.auth().createCustomToken(user._id.toString(), {
      role: user.role || 'customer'
    });

    // Fetch user profile from Firestore
    let userProfile = {};
    try {
      const profileDoc = await db.collection("Auth").doc(user._id.toString()).get();
      if (profileDoc.exists) {
        userProfile = profileDoc.data();
      }
    } catch (e) {
      console.warn('Could not fetch user profile from Firestore:', e.message);
    }

    res.json({
      success: true,
      message: "User logged in",
      token,
      firebaseToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: userProfile.fullName || userProfile.name || '',
        phone: userProfile.phone || '',
        gender: userProfile.gender || '',
        image: userProfile.image || ((userProfile.gender === 'Male') ? '/men.png' : '/female.png'),
        note: userProfile.note || '',
        age: userProfile.age || '',
      }
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ msg: "Server error" });

  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If email exists, reset link has been sent"
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"FlawSkinSupport Team" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
      `
    });

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Token invalid or expired"
      });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



router.post("/send-otp", async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({
        msg: "Email already registered! Please login."
      });
    }

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.findOneAndUpdate(
      { email, role: "user" },
      {
        otp: hashedOTP,
        attempts: 0,
        expires: new Date(Date.now() + 5 * 60 * 1000),
        role: "user"
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `<h2>FlawSkin Support Team</h2> <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This OTP expires in 5 minutes.</p>
      `
    });

    res.json({ msg: "OTP sent successfully" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ msg: "Server error" });

  }

});



router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, role: "user" });

    if (!record) {
      return res.status(400).json({ msg: "OTP not found" });
    }

    if (record.expires < new Date()) {

      await OTP.deleteOne({ email });

      return res.status(400).json({ msg: "OTP expired" });

    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        msg: "Too many attempts. Request new OTP."
      });
    }

    const valid = await bcrypt.compare(String(otp), record.otp);

    if (!valid) {

      record.attempts += 1;
      await record.save();

      return res.status(400).json({ msg: "Invalid OTP" });

    }

    await OTP.deleteOne({ email });

    res.json({
      success: true,
      msg: "OTP verified successfully"
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ msg: "Server error" });

  }

});


module.exports = router;