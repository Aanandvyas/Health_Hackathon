import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { PatientModel, ChatHistoryModel, DoctorModel } from "./models.js";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs"; 
import nodemailer from 'nodemailer';
import client from 'prom-client';
import compression from 'compression';

// 1. CONFIGURATION
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
    'http://localhost:5173',
    'https://health-hackathon-frontend-1005382078632.asia-south1.run.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.json()); // Crucial for reading request bodies
app.use(compression());

// Create a transporter object using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();


const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"));
};

// --- MONGODB & GRIDFS SETUP ---
let gfs;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(conn => {
    console.log("✅ Connected to MongoDB: healthDB");
    gfs = new mongoose.mongo.GridFSBucket(conn.connection.db, {
      bucketName: 'reports'
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// --- GRIDFS STORAGE ENGINE ---
const storage = new GridFsStorage({
  url: MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'reports',
          metadata: { patientId: req.user.id } // Link file to the patient
        };
        resolve(fileInfo);
      });
    });
  }
});

// --- MULTER CONFIGURATION ---
const upload = multer({
  storage,
  limits: { fileSize: 580 * 1024 }, // 580 KB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Invalid file type. Only PNG, JPG, or JPEG are allowed."));
  }
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

// --- User Authentication ---
// Add this BEFORE your existing /register route
app.post("/register", async (req, res) => {
  console.log("\n=== REGISTRATION REQUEST RECEIVED ===");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Body type:", typeof req.body);
  console.log("Body empty?", !req.body || Object.keys(req.body).length === 0);
  
  try {
    // Step 1: Check request body
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("❌ Request body is empty");
      return res.status(400).json({ 
        message: "Request body is missing or empty.",
        debug: "No data received"
      });
    }

    // Step 2: Log received data
    const { name, age, sex, height, weight, email, password, mobile_number, medical_history } = req.body;
    console.log("Extracted fields:", { 
      name, age, sex, height, weight, email, 
      password: password ? "[PROVIDED]" : "[MISSING]",
      mobile_number, medical_history 
    });

    // Step 3: Validate required fields
    const requiredFields = { name, age, sex, height, weight, email, password };
    const missingFields = [];
    
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value && value !== 0) { // 0 is valid for age, height, weight
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      console.log("❌ Missing required fields:", missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        debug: { requiredFields: Object.keys(requiredFields), received: Object.keys(req.body) }
      });
    }

    // Step 4: Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log("❌ MongoDB not connected. State:", mongoose.connection.readyState);
      return res.status(500).json({ 
        message: "Database connection error",
        debug: "MongoDB not connected"
      });
    }
    console.log("✅ MongoDB connected");

    // Step 5: Check for existing user
    console.log("Checking for existing user...");
    const query = mobile_number ? { $or: [{ email }, { mobile_number }] } : { email };
    const existingUser = await PatientModel.findOne(query);

    if (existingUser) {
      const errorMessage = existingUser.email === email 
        ? "User with this email already exists." 
        : "User with this mobile number already exists.";
      console.log("❌ User already exists:", errorMessage);
      return res.status(400).json({ message: errorMessage });
    }
    console.log("✅ No existing user found");

    // Step 6: Create user object
    console.log("Creating user object...");
    const userData = {
      name: String(name),
      age: Number(age),
      sex: String(sex),
      height: Number(height),
      weight: Number(weight),
      email: String(email).toLowerCase(),
      password: String(password),
      medical_history: medical_history || []
    };

    if (mobile_number) {
      userData.mobile_number = String(mobile_number);
    }

    console.log("User data prepared:", {
      ...userData,
      password: "[HIDDEN]"
    });

    // Step 7: Create and save user
    console.log("Creating PatientModel instance...");
    const newUser = new PatientModel(userData);
    
    console.log("Saving user to database...");
    await newUser.save();
    
    console.log("✅ User saved successfully");

    // Step 8: Prepare response
    const userResponse = newUser.toObject();
    delete userResponse.password;
    delete userResponse.passwordResetOTP;
    delete userResponse.passwordResetExpires;

    console.log("✅ Registration completed successfully");
    res.status(201).json({ 
      message: "Registration successful", 
      user: userResponse 
    });

  } catch (err) {
    console.log("\n❌ REGISTRATION ERROR OCCURRED:");
    console.log("Error name:", err.name);
    console.log("Error message:", err.message);
    console.log("Error code:", err.code);
    console.log("Full error:", err);
    
    if (err.stack) {
      console.log("Stack trace:", err.stack);
    }

    // Handle specific error types
    if (err.name === 'ValidationError') {
      console.log("Validation errors:", err.errors);
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        message: messages.join(' '),
        debug: "Mongoose validation error",
        errors: err.errors
      });
    }

    if (err.code === 11000) {
      console.log("Duplicate key error:", err.keyValue);
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ 
        message: `An account with this ${field} already exists.`,
        debug: "Duplicate key error"
      });
    }

    // Generic error response
    return res.status(500).json({ 
      message: "An internal server error occurred.",
      debug: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});


// ✅ User Login
app.post("/login", async (req, res) => {
  try {
    const { email, password }  = req.body;
    const user = await PatientModel.findOne({ email });

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

app.get("/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    port: PORT || 3001,
    mongodb: {
      state: mongoose.connection.readyState,
      states: {
        0: "disconnected",
        1: "connected", 
        2: "connecting",
        3: "disconnecting"
      }
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      MONGO_URI: process.env.MONGO_URI ? "SET" : "NOT SET",
      JWT_SECRET: process.env.JWT_SECRET ? "SET" : "NOT SET"
    }
  });
});

// Add this endpoint temporarily
app.get("/fix-mobile-index", async (req, res) => {
  try {
    console.log("Fixing mobile_number index...");
    
    // Drop the existing index
    await PatientModel.collection.dropIndex("mobile_number_1");
    console.log("✅ Dropped mobile_number_1 index");
    
    // Create a new sparse unique index
    await PatientModel.collection.createIndex(
      { mobile_number: 1 }, 
      { unique: true, sparse: true }
    );
    console.log("✅ Created new sparse unique index on mobile_number");
    
    res.json({ 
      message: "Mobile number index fixed successfully"
    });
  } catch (error) {
    console.error("Error fixing index:", error);
    res.status(500).json({ 
      message: "Error fixing index", 
      error: error.message 
    });
  }
});

// Add these endpoints for debugging
app.get("/check-indexes", async (req, res) => {
  try {
    const indexes = await PatientModel.collection.getIndexes();
    console.log("Current indexes:", indexes);
    res.json({ 
      message: "Current indexes for patients collection",
      indexes: indexes
    });
  } catch (error) {
    console.error("Error checking indexes:", error);
    res.status(500).json({ 
      message: "Error checking indexes", 
      error: error.message 
    });
  }
});

app.get("/fix-database-index", async (req, res) => {
  try {
    console.log("Attempting to fix the mobile_number index...");
    
    // Drop the potentially faulty index. 
    // Mongoose names it `mobile_number_1` by default.
    await PatientModel.collection.dropIndex("mobile_number_1");
    console.log("✅ Successfully dropped old index.");

    // Mongoose will automatically recreate the correct (sparse) index on next startup or operation.
    // To be sure, we can recreate it manually.
    await PatientModel.collection.createIndex(
        { mobile_number: 1 },
        { unique: true, sparse: true }
    );
    console.log("✅ Successfully created new sparse index.");

    res.status(200).send("<h1>Database index has been successfully fixed!</h1><p>You can now close this tab and try registering again. Please remove the /fix-database-index route from your index.js file afterwards.</p>");
  } catch (error) {
    console.error("Error fixing index:", error);
    res.status(500).json({ 
      message: "Could not fix index. It might have already been fixed or dropped. Please check the server logs.",
      error: error.message
    });
  }
});

// Enhanced fix that handles different index names
app.get("/fix-mobile-index-enhanced", async (req, res) => {
  try {
    console.log("Checking and fixing mobile_number index...");
    
    const indexes = await PatientModel.collection.getIndexes();
    console.log("Current indexes:", Object.keys(indexes));
    
    // Find mobile_number related indexes
    const mobileIndexes = Object.keys(indexes).filter(name => 
      name.includes('mobile_number')
    );
    
    console.log("Mobile number indexes found:", mobileIndexes);
    
    // Drop all mobile_number indexes
    for (const indexName of mobileIndexes) {
      try {
        await PatientModel.collection.dropIndex(indexName);
        console.log(`✅ Dropped index: ${indexName}`);
      } catch (err) {
        console.log(`⚠️ Could not drop index ${indexName}:`, err.message);
      }
    }
    
    // Create new sparse unique index
    await PatientModel.collection.createIndex(
      { mobile_number: 1 }, 
      { unique: true, sparse: true }
    );
    console.log("✅ Created new sparse unique index on mobile_number");
    
    res.json({ 
      message: "Mobile number index fixed successfully",
      droppedIndexes: mobileIndexes
    });
  } catch (error) {
    console.error("Error fixing index:", error);
    res.status(500).json({ 
      message: "Error fixing index", 
      error: error.message 
    });
  }
});

// Add this endpoint for debugging (remove in production)
app.get("/debug", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 3001,
    mongoUri: process.env.MONGO_URI ? "SET" : "NOT SET",
    jwtSecret: process.env.JWT_SECRET ? "SET" : "NOT SET",
    mongooseState: mongoose.connection.readyState,
    mongooseStates: {
      0: "disconnected",
      1: "connected", 
      2: "connecting",
      3: "disconnecting"
    }
  });
});

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


// ✅ UPLOAD REPORTS
app.post("/api/upload-reports", authenticateToken, upload.array("reports", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      id: file.id,
      contentType: file.contentType,
    }));
    res.status(201).json({
        message: "Reports uploaded successfully",
        files: uploadedFiles
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading reports", error: error.message });
  }
});

// ✅ GET REPORTS METADATA
app.get("/api/get-reports", authenticateToken, async (req, res) => {
  try {
    if (!gfs) {
      return res.status(500).json({ message: "GridFS not initialized." });
    }
    const files = await gfs.find({ 'metadata.patientId': req.user.id }).toArray();
    if (!files || files.length === 0) {
      return res.status(200).json([]);
    }
    res.json(files);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// ✅ GET A SPECIFIC REPORT IMAGE
app.get("/api/reports/image/:filename", async (req, res) => {
    try {
        if (!gfs) {
            return res.status(500).json({ message: "GridFS not initialized." });
        }
        const files = await gfs.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'That file does not exist' });
        }
        const readStream = gfs.openDownloadStreamByName(req.params.filename);
        readStream.pipe(res);
    } catch (err) {
        console.error("Image serving error:", err);
        res.status(500).send('Server Error');
    }
});

// ✅ DELETE A SPECIFIC REPORT IMAGE
app.delete("/api/reports/image/:id", authenticateToken, async (req, res) => {
  try {
    if (!gfs) {
      return res.status(500).json({ message: "GridFS not initialized." });
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if the file exists and belongs to the user
    const files = await gfs.find({ _id: fileId, 'metadata.patientId': req.user.id }).toArray();
    if (!files || files.length === 0) {
        return res.status(404).json({ message: 'File not found or you do not have permission to delete it.' });
    }

    // Delete the file from GridFS
    await gfs.delete(fileId);
    
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("File deletion error:", err);
    // Handle cases where the provided ID is not a valid ObjectId
    if (err.name === 'BSONTypeError') {
        return res.status(400).json({ message: 'Invalid file ID format.' });
    }
    res.status(500).send('Server Error');
  }
});

// STEP 1: User requests an OTP via email
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await PatientModel.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "User with this email not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    patient.passwordResetOTP = otp;
    patient.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await patient.save();

    // --- SEND THE EMAIL ---
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patient.email,
      subject: 'Your Password Reset OTP for Health Menta',
      text: `Hello ${patient.name},\n\nYour password reset OTP is: ${otp}\n\nThis code will expire in 10 minutes.\n`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email address." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending OTP email." });
  }
});

/// STEP 2: User submits OTP and new password (with Debugging)
app.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    const patient = await PatientModel.findOne({ email });

    if (!patient) {
      console.log("DEBUG: No patient found with that email.");
      return res.status(400).json({ message: "Invalid OTP or OTP has expired." });
    }

    

    const isOtpValid = patient.passwordResetOTP === otp.trim(); // Trim whitespace from user input
    const isOtpExpired = patient.passwordResetExpires < Date.now();

    if (!isOtpValid || isOtpExpired) {
      console.log("DEBUG: OTP check failed.");
      return res.status(400).json({ message: "Invalid OTP or OTP has expired." });
    }

    patient.password = newPassword;
    patient.passwordResetOTP = undefined;
    patient.passwordResetExpires = undefined;
    await patient.save();

    res.status(200).json({ message: "Password has been reset successfully." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
});

// --- Metrics ---
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// ✅ Start the server
app.listen(PORT,"0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});