import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Navbar() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/user/profile/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          console.log(response.data)
        } catch (error) {
          console.log("Failed to fetch profile");
          setUser(null);
        }
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <nav className="bg-green-600 p-4 text-white flex justify-between items-center">
      {/* Left side - Logo */}
      <div className="font-bold text-xl">
        <Link to="/">PawarFarm</Link>
      </div>

      {/* Middle - Navigation links */}
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/products" className="hover:underline">
          Products
        </Link>
        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {user && !user.is_email_verified && (
          <>
            <Link to="/get_email_otp" className="hover:underline">
              Verify Email
            </Link>
          </>
        )}
        {user && user.is_email_verified &&(
            <>
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>
            <Link to="/customer/orders" className="hover:underline">
              Orders
            </Link>
          </>
        )}
        {user && user.role=='staff'  &&(
          <Link to="/staff/orders" className="hover:underline">
              Manage Orders
            </Link>
        )}
        <Link to="/about" className="hover:underline">
               Explore My Work
        </Link>
      </div>

      {/* Right side - Username and Logout */}
      <div className="flex items-center space-x-4">
        {user && <span>Logged in as {user.username}</span>}
        {user && (
          <button onClick={logout} className="hover:underline text-white">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
