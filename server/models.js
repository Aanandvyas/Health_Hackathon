import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* 🔹 Patient Schema */
const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { 
    type: String, 
    enum: ["Male", "Female", "Other"], 
    required: true 
  },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  email: { // 👈 Add this block
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  mobile_number: { // 👈 Make this optional if needed
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    index: true
  },
  password: { type: String, required: true },
  passwordResetOTP: { type: String },
  passwordResetExpires: { type: Date },
  medical_history: { type: [String], default: [] },
  appointments: [{
    doctor_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Doctor"  
    },
    doctorName: String,
    date: Date,
    time: String,
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Cancelled"], 
      default: "Pending" 
    }
  }],
  medicines: [{
    name: { type: String, required: true },
    description: String,
    dosage: String,
    time: String
  }],
  
  photo: {type: String}
}, { timestamps: true });


/* 🔹 Hash password before saving */
PatientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const PatientModel = mongoose.model("patients", PatientSchema);

/* 🔹 Chat History Schema */
const ChatHistorySchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "patients", required: true },
  user_message: { type: String, required: true },
  bot_response: { type: String, required: true },
  tokens_used: { type: Number, default: 0 }
}, { timestamps: true });

const ChatHistoryModel = mongoose.model("chat_history", ChatHistorySchema);

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  speciality: { type: String, required: true },
  experience: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profileLink: { type: String, default: "#" },
  imageUrl: { type: String, required: true }
}, { timestamps: true });

// Change here: register the Doctor model with the name "Doctor"
const DoctorModel = mongoose.model("Doctor", DoctorSchema);

export { DoctorModel, PatientModel, ChatHistoryModel };