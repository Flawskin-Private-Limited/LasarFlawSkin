require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const axios = require("axios");
const Admin = require("../models/admin");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const generateOTP = require("../util/generateOTP");
const OTP = require("../models/otp");
const db = require("../config/firebase");
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
    const { name,email,password } = req.body;
      
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(201).json({ msg: "Admin already exists",console:exists });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      email,
      passwordHash: hash
    });

    await db.collection("Admin").doc(admin._id.toString()).set({
      name,
      email,
      createdAt: new Date()
    }); 
    res.json({ msg: "Admin created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


const firebaseAdmin = require("firebase-admin");

router.post("/login", async (req, res) => {
  try {
    const adminUser = await Admin.findOne({ email: req.body.email });

    if (!adminUser || !(await bcrypt.compare(req.body.password, adminUser.passwordHash)))
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: adminUser._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const firebaseToken = await firebaseAdmin.auth().createCustomToken(adminUser._id.toString(), {
      role: 'admin'
    });

    res.json({ msg: "Admin logged in", token, firebaseToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/admin-forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour FIX

    await admin.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/admin/admin-reset-password/${resetToken}`;


    await transporter.sendMail({
      from: `"FlawSkin Admin Support" <${process.env.EMAIL_USER}>`,
      to: admin.email,
      subject: "Admin Password Reset",
      html: `
        <h3>Admin Password Reset</h3>
        <p>Click below to reset your admin password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link expires in 1 hour.</p>
      `
    });

      res.status(200).json({
          message: "Reset link sent"
      });  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/admin-reset-password/:token", async (req, res) => {
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

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() } 
    });
     console.log("Admin found for reset:", admin ? admin.email : "None");
    if (!admin) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    admin.passwordHash = await bcrypt.hash(password, 10);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();

    res.json({ message: "Admin password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/send-otp", async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    const exists = await Admin.findOne({ email });

    if (exists) {
      return res.status(409).json({
        msg: "Email already registered! Please login."
      });
    }

    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 10);

    await OTP.findOneAndUpdate(
      { email,role:"admin" },
      {
        otp: hashedOTP,
        attempts: 0,
        expires: new Date(Date.now() + 5 * 60 * 1000)
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `<h2>FlawSkin Admin Support Team</h2> <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This OTP expires in 5 minutes.</p>
      `
    });

    res.json({
      msg: "OTP sent successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.post("/verify-otp", async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, role: "admin" });

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