import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PatientModel, ChatHistoryModel } from "./models.js"; // Ensure PatientModel has a pre-save hook for password hashing

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use a strong secret key in production

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB: healthDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Register route
app.post("/register", async (req, res) => {
  try {
    const { mobile_number, password, ...rest } = req.body;

    // Check if user already exists
    const existingUser = await PatientModel.findOne({ mobile_number });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user using the plain password.
    // The PatientModel's pre-save hook should hash the password before saving.
    const newUser = new PatientModel({ mobile_number, password, ...rest });
    await newUser.save();

    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(500)
      .json({ message: "Error registering patient", error: err.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    const user = await PatientModel.findOne({ mobile_number });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Create JWT token with user id as payload
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Middleware to verify JWT (expects "Bearer <token>" format)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Extract token from the "Bearer <token>" string
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

// Get user's medicines
app.get("/medicines", authenticateToken, async (req, res) => {
  try {
    const user = await PatientModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.medicines);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching medicines", error: err.message });
  }
});

// Add a new medicine
app.post("/add-medicine", authenticateToken, async (req, res) => {
  try {
    const { name, description, dosage, time } = req.body;
    const user = await PatientModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Add new medicine to the user's medicines array
    user.medicines.push({ name, description, dosage, time });
    await user.save();

    res.json({ message: "Medicine added", medicines: user.medicines });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding medicine", error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
