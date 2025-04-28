import axios from "axios";
import { useState } from "react";
import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/login", {
        mobile_number: mobileNumber, // ✅ Fixing field name
        password,
      })
// In Login.tsx
      .then((res) => {
        console.log("Server Response:", res.data);

        if (res.data.message === "Login successful" && res.data.user) {
          // Store user data AND token
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token); // 🚀 Add this line
          navigate("/Health-Menta");
          window.location.reload();
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
            <label className="block text-white font-bold">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              placeholder="Enter Mobile Number"
              name="mobile"
              required
              onChange={(e) => setMobileNumber(e.target.value)}
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
            <Link to="#" className="text-white underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
