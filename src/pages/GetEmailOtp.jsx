import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SendEmailOTP() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to verify your email.");
        return;
      }
      try {
        const response = await axios.get(
          `${API_URL}/api/user/profile/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserEmail(response.data.email);
      } catch (err) {
        setError("Failed to fetch user profile.");
      }
    };
    fetchUserProfile();
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to verify your email.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/user/get_email_otp/`,
        {}, // no body needed
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message || "OTP sent successfully!");

      // Redirect after short delay to show message
      setTimeout(() => {
        navigate("/verify_email");
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to send OTP. Try again.");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        onSubmit={handleSendOTP}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-700">
          Verify Your Email
        </h2>

        {userEmail && (
          <p className="mb-4 text-gray-700">
            OTP will be sent to: <strong>{userEmail}</strong>
          </p>
        )}

        {message && (
          <div className="mb-4 text-green-700 font-semibold">{message}</div>
        )}

        {error && (
          <div className="mb-4 text-red-600 font-semibold">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}

export default SendEmailOTP;
