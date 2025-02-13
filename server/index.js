import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PatientModel, ChatHistoryModel, DoctorModel } from "./models.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET; 

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB: healthDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

// ✅ Register a new user
app.post("/register", async (req, res) => {
  try {
    const { mobile_number, password, ...rest } = req.body;

    // Check if user already exists
    const existingUser = await PatientModel.findOne({ mobile_number });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user (password hashing is handled in the model)
    const newUser = new PatientModel({ mobile_number, password, ...rest });
    await newUser.save();

    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Error registering patient", error: err.message });
  }
});

// ✅ User Login
app.post("/login", async (req, res) => {
  try {
    const { mobile_number, password } = req.body;
    const user = await PatientModel.findOne({ mobile_number });

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/appointments", authenticateToken, async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.user.id)
      .populate("appointments.doctor_id");
    if (!patient) return res.status(404).json({ message: "User not found" });

    // Always return an array (if appointments is falsy, send an empty array)
    res.json(patient.appointments || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error: error.message });
  }
});

// ✅ Book an appointment
app.post("/api/appointments/book", authenticateToken, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const patientId = req.user.id;
    
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const patient = await PatientModel.findByIdAndUpdate(
      patientId,
      {
        $push: { 
          appointments: { 
            doctor_id: doctorId, 
            doctorName: doctor.name, // Ensure doctor name is added
            date, 
            time, 
            status: "Pending" 
          }
        },
      },
      { new: true }
    );

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.status(200).json({ 
      message: "Appointment booked successfully", 
      appointments: patient.appointments 
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error booking appointment", 
      error: error.message 
    });
  }
});
// ✅ Get user's medicines
app.get("/medicines", authenticateToken, async (req, res) => {
  try {
    const user = await PatientModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.medicines);
  } catch (err) {
    res.status(500).json({ message: "Error fetching medicines", error: err.message });
  }
});

// ✅ Add a new medicine
app.post("/add-medicine", authenticateToken, async (req, res) => {
  try {
    const { name, description, dosage, time } = req.body;
    const user = await PatientModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.medicines.push({ name, description, dosage, time });
    await user.save();

    res.json({ message: "Medicine added", medicines: user.medicines });
  } catch (err) {
    res.status(500).json({ message: "Error adding medicine", error: err.message });
  }
});

// ✅ Retrieve all doctors
app.get("/doctors", async (req, res) => {
  try {
    console.log('Received GET request for doctors');
    const doctors = await DoctorModel.find(); 

    if (doctors.length === 0) return res.status(404).json({ message: "No doctors found" });

    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors", error: err.message });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});


app.get("/api/getPatientId", authenticateToken, async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: "User not found" });
    // Convert the ObjectId to a string (optional, as JSON.stringify does this automatically)
    res.json({ patientId: patient._id.toString() });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error: error.message });
  }
});
