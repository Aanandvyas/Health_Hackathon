import axios from "axios";
import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState(""); // Changed from mobileNumber
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // The useNavigate hook was removed as it was causing a crash.
  // We will use a standard browser redirect instead.

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", {
        email: email, // Changed from mobile_number
        password,
      })
      .then((res) => {

        if (res.data.message === "Login successful" && res.data.user) {
          // Store user data AND token
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);
          
          // --- CHANGE: Replaced navigate() with a standard redirect ---
          // This avoids the hook-related error and achieves the same goal.
          window.location.href = "/Health-Menta";
        } else {
          setError(res.data.message || "Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setError(error.response?.data?.message || "Login error. Please try again later.");
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-blue-600 p-10 rounded-2xl shadow-lg text-center w-96">
        <h2 className="text-white text-2xl font-semibold">Health Mentá</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4 text-left">
            <label className="block text-white font-bold">Email Address</label> {/* Changed label */}
            <input
              type="email" // Changed type
              id="email"
              placeholder="Enter Email Address"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)} // Changed state setter
              className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="password" className="block text-white font-bold">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              name="password"
              required
              className="w-full mt-2 p-2 border border-white bg-white rounded-md text-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 font-bold text-sm mb-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-1/2 bg-white text-black py-2 rounded-md font-semibold hover:bg-black hover:text-white transition duration-300"
          >
            Login
          </button>
          <div className="mt-4 text-sm">
            <span className="text-white">
              Don't have an account? <Link to="/Health-Menta/register" className="underline">Sign up</Link>
            </span>
          </div>
          <div className="mt-2 text-sm">
            <Link to="/Health-Menta/forgot-password" className="text-white underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
