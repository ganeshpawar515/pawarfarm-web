import { useState } from "react";
import axios from "axios";

function Register() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState(null);        // 👈 for backend response
  const [isError, setIsError] = useState(false);        // 👈 whether response is error

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const response = await axios.post(`${API_URL}/api/user/create/`, {
        username,
        email,
        password,
        phone_number: phoneNumber,
        address,
      });

      // Handle success message
      setMessage(response.data.message);
      setIsError(false);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setMessage(backendMessage);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleRegister}
      >
        <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
          Create an Account
        </h2>

        {/* Full Name */}
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Your full name"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Email */}
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Phone Number */}
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone_number"
          placeholder="1234567890"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {/* Address */}
        <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          placeholder="Your address"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
        ></textarea>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login here
          </a>
        </p>

        {/* ✅ Message Display */}
        {message && (
          <div
            className={`mt-6 text-center px-4 py-2 rounded ${
              isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {typeof message === "string"
              ? message
              : JSON.stringify(message, null, 2)}
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
