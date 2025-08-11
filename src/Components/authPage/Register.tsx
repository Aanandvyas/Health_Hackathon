import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Use the environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  console.log("=== REGISTRATION DEBUG START ===");
  console.log("API_URL:", API_URL);
  console.log("Environment check:", {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV,
    DEV: import.meta.env.DEV
  });

  // FIX: Add explicit validation for the 'sex' field.
  if (!sex) {
    setError("Please select a value for Sex.");
    return;
  }

  const numericAge = parseInt(age, 10);
  const numericHeight = parseInt(height, 10);
  const numericWeight = parseInt(weight, 10);

  if (isNaN(numericAge) || isNaN(numericHeight) || isNaN(numericWeight)) {
    setError("Age, height, and weight must be valid numbers.");
    return;
  }

  const registrationData = {
    email: email,
    password,
    name,
    age: numericAge,
    sex,
    medical_history: medicalHistory ? medicalHistory.split(',').map(item => item.trim()) : [],
    height: numericHeight,
    weight: numericWeight,
  };

  console.log("Registration data:", registrationData);
  console.log("Making request to:", `${API_URL}/register`);

  try {
    const response = await axios.post(`${API_URL}/register`, registrationData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
    
    console.log("✅ Registration successful:", response.data);
    
    if (response.status === 201) {
      navigate("/login");
    }
    
  } catch (error: any) {
    console.log("❌ REGISTRATION ERROR DETAILS:");
    console.log("Error object:", error);
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    console.log("Error code:", error.code);
    
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response headers:", error.response.headers);
      console.log("Response data:", error.response.data);
      
      // Show specific server error message
      if (error.response.data && error.response.data.message) {
        setError(`Server Error: ${error.response.data.message}`);
      } else if (error.response.data && error.response.data.debug) {
        setError(`Debug Info: ${error.response.data.debug}`);
      } else {
        setError(`HTTP ${error.response.status}: ${error.response.statusText}`);
      }
    } else if (error.request) {
      console.log("Request made but no response:", error.request);
      setError("No response from server. Is the backend running on http://localhost:3001?");
    } else {
      console.log("Error setting up request:", error.message);
      setError(`Request setup error: ${error.message}`);
    }
  }
};

  return (
    <div className="flex justify-center items-center mt-12 min-h-screen bg-white p-6">
      <div className="bg-blue-600 p-10 rounded-2xl shadow-lg text-center w-96">
        <h2 className="text-white text-2xl font-semibold">Health Mentá</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          {error && (
            <div className="mb-4 text-sm font-bold text-red-300 bg-red-800 p-2 rounded">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-4 text-left">
            <label className="block text-white font-bold">Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter Full Name"
              className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          {/* Email Address */}
          <div className="mb-4 text-left">
            <label className="block text-white font-bold">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              required
              className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="mb-4 text-left">
            <label className="block text-white font-bold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Strong Password"
              required
              className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Age & Gender */}
          <div className="mb-4 flex justify-between gap-8 text-left">
            <div className="w-1/2">
              <label className="block text-white font-bold">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                min="1"
                required
                className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
                onChange={(e) => setAge(e.target.value)}
                value={age}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-white font-bold">Sex</label>
              <select
                name="sex"
                required
                className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
                onChange={(e) => setSex(e.target.value)}
                value={sex}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Height & Weight */}
          <div className="mb-4 flex justify-between gap-8 text-left">
            <div className="w-1/2">
              <label className="block text-white font-bold">Height (cm)</label>
              <input
                type="number"
                name="height"
                placeholder="Height"
                min="0"
                required
                className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
                onChange={(e) => setHeight(e.target.value)}
                value={height}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-white font-bold">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                placeholder="Weight"
                min="0"
                required
                className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="mb-4 text-left">
            <label className="block text-white font-bold">Medical History</label>
            <textarea
              name="medicalHistory"
              placeholder="e.g., allergies, chronic diseases"
              rows={2}
              className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
              onChange={(e) => setMedicalHistory(e.target.value)}
              value={medicalHistory}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-black hover:text-white transition duration-300"
          >
            Create Account
          </button>
          <div className="mt-4 text-sm">
            <span className="text-white">
              Already have an account? <Link to="/login" className="underline">Log in</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
