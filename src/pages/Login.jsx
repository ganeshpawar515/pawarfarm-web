import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const {login}=useAuth()
  const API_URL=import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch user profile after login
  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      console.error("Failed to fetch profile", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/api/token/`, {
      email,
      password,
    });

    const { access, refresh, role } = response.data;

    // Store refresh token (optional, depending on your app's needs)
    localStorage.setItem("refresh_token", refresh);

    // Login via AuthContext (this will store token + fetch profile automatically)
    login(access);

    alert("Login successful!");

    // Redirect user based on role
    if (role === "customer") {
      navigate("/home");
    } else if (role === "staff") {
      navigate("/");
    } else if (role === "delivery") {
      navigate("/delivery/orders");
    } else {
      navigate("/"); // fallback
    }
  } catch (err) {
    console.log(err);
    if (err.response && err.response.data) {
      setError(err.response.data.detail || "Login failed");
    } else {
      setError("Login failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          PawarFarm Login
        </h2>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">{error}</div>
        )}

        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Your password"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
