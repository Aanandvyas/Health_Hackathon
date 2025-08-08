import axios from "axios";
import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState(""); // Changed from mobileNumber
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("http://localhost:3001/register", {
      email: email, // Changed from mobile_number
      password,
      name,
      age,
      sex,
      medical_history: medicalHistory.split(',').map(item => item.trim()), // Send as an array
      height,
      weight,
    })
    .then((loginRes) => {
        if (loginRes.data.message === "Login successful" && loginRes.data.user) {
            localStorage.setItem("user", JSON.stringify(loginRes.data.user));
            localStorage.setItem("token", loginRes.data.token);
            navigate("/");
            window.location.reload();
        } else {
            setError("Registration successful, but auto-login failed.");
        }
    })
    .catch((err) => {
      if (err.response) {
        setError(`Failed to register: ${err.response.data.message || err.response.statusText}`);
      } else {
        setError("Error setting up your registration request.");
      }
      console.error("Registration error:", err);
    });
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
        </form>
      </div>
    </div>
  );
};

export default Register;
