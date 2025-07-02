import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("You must be logged in to verify your email.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/user/verify_email_otp/`,
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        setLoading(false);
        return;
      }

      setMessage("Email Verified successfully!");

      // Delay navigation to show message
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };
  const handleResendOtp = async () => {
  setMessage(null);
  setError(null);
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You must be logged in to resend OTP.");
      return;
    }

    await axios.post(`${API_URL}/api/user/get_email_otp/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setMessage("A new OTP has been sent to your email.");
  } catch (err) {
    setError("Failed to resend OTP.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We've sent a 6-digit code to your email. Enter it below to verify your
          account.
        </p>

        <form onSubmit={handleVerify}>
          <label
            htmlFor="otp"
            className="block text-gray-700 font-medium mb-1"
          >
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            placeholder="e.g. 123456"
            maxLength={6}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Show messages */}
        {message && (
          <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-500">
            Didn’t receive the code?{" "}
            <button
                className="text-blue-600 hover:underline"
                type="button"
                onClick={handleResendOtp}
            >
                Resend OTP
            </button>
        </p>

      </div>
    </div>
  );
}

export default VerifyEmail;
