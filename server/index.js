import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PatientModel, ChatHistoryModel, DoctorModel } from "./models.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs"; // Add filesystem module

dotenv.config();

const app = express();
const PORT = 3001;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET; 

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir)); // Serve uploaded images

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB: healthDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 } }); // 1MB limit


dotenv.config();

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
    if (err) {
      console.error("Token verification failed:", err);  // Add logging here
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.user = decoded;
    next();
  });
};


app.delete("/api/appointments/:appointmentId", authenticateToken, async (req, res) => {

  try {
    const { appointmentId } = req.params; // Extract the appointmentId from the URL

    // Ensure the patient owns this appointment
    const patient = await PatientModel.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Remove the appointment by its _id
    const updatedPatient = await PatientModel.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { appointments: { _id: appointmentId } }, // Remove the appointment by _id
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Appointment not found or already cancelled" });
    }

    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment", error: error.message });
  }
});



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

app.delete("/remove-medicine/:medicineId", authenticateToken, async (req, res) => {
  try {
    const { medicineId } = req.params;
    const result = await PatientModel.findByIdAndUpdate(
      req.user.id,
      { $pull: { medicines: { _id: medicineId } } },
      { new: true }
    );
    if (!result) return res.status(404).json({ message: "Medicine not found" });

    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error("Error removing medicine:", error);
    res.status(500).json({ message: "Error removing medicine", error: error.message });
  }
});



app.get("/api/getPatientId", authenticateToken, async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: "User not found" });

    // Include the patient ID in the response
    res.json({ 
      patientId: patient._id, 
      name: patient.name, 
      medical_history: patient.medical_history,
      height: patient.height,
      weight: patient.weight
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching patient", error: error.message });
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
    
    const doctors = await DoctorModel.find(); 

    if (doctors.length === 0) return res.status(404).json({ message: "No doctors found" });

    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Error fetching doctors", error: err.message });
  }
});

// ✅ Start the server
app.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

app.put("/api/updateProfile", authenticateToken, async (req, res) => {
  try {
    const { name, height, weight, medical_history } = req.body;

    // Ensure all necessary fields are provided
    if (!name || !height || !weight || !medical_history) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update the patient profile
    const patient = await PatientModel.findByIdAndUpdate(
      req.user.id,
      { name, height, weight, medical_history },
      { new: true } // Return the updated patient
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
});

app.post("/api/upload-reports", authenticateToken, upload.array("reports", 5), async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.user.id);
    if (!patient) return res.status(404).json({ message: "User not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Generate an array of filenames
    const fileNames = req.files.map((file) => file.filename);
    patient.reports = [...(patient.reports || []), ...fileNames];
    await patient.save();


    res.status(201).json({ message: "Reports uploaded successfully", filenames: fileNames });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading reports" });
  }
});


app.get("/api/get-reports", authenticateToken, async (req, res) => {
  try {
    const patient = await PatientModel.findById(req.user.id);
    if (!patient || !patient.reports || patient.reports.length === 0) {
      return res.status(404).json({ message: "No reports found" });
    }
    res.json({ filenames: patient.reports });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});
