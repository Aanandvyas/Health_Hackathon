import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Use the standard hook for navigation.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 2. Use the API_URL variable for the request.
    axios
      .post(`${API_URL}/login`, {
        email: email,
        password,
      })
      .then((res) => {
        if (res.data.message === "Login successful" && res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);
          
          // Notify other components (like the NavBar) of the login.
          window.dispatchEvent(new Event("storage"));

          // Use navigate() for a seamless SPA redirect.
          navigate("/");
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
            <label className="block text-white font-bold">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email Address"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
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
              Don't have an account? <Link to="/register" className="underline">Sign up</Link>
            </span>
          </div>
          <div className="mt-2 text-sm">
            <Link to="/forgot-password" className="text-white underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
