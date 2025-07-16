import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {useAuth} from "../context/AuthContext"
export default function Navbar() {
  const API_URL=import.meta.env.VITE_API_URL;
  const {isLoggedIn,logout, user}=useAuth();
  const handleLogout = () => {
    logout();
  };
  useEffect(()=>{
    if(isLoggedIn && user){
    console.log(user.role)
    }
  },[])

  return (
    <nav className="bg-green-600 p-4 text-white flex justify-between items-center">
      {/* Left side - Logo */}
      <div className="font-bold text-xl">
        <Link to="/">PawarFarm</Link>
      </div>

      {/* Middle - Navigation links */}
      
      <div className="space-x-4">
        {(!user || user.role!='delivery') &&(
          <>
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/products" className="hover:underline">
          Products
        </Link>
          </>
      ) }
        {!isLoggedIn && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {isLoggedIn && user && !user.is_email_verified && (
          <>
            <Link to="/get_email_otp" className="hover:underline">
              Verify Email
            </Link>
          </>
        )}
        {isLoggedIn && user && user.role=='customer' && user.is_email_verified &&(
            <>
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>
            <Link to="/customer/orders" className="hover:underline">
              Orders
            </Link>
          </>
        )}
        {isLoggedIn && user && user.role=='staff'  &&(<>
          <Link to="/staff/orders" className="hover:underline">
              Manage Orders
            </Link> 
            <Link to="/staff/add-products" className="hover:underline">
              Add Products
            </Link>
            </>
        )}
        {isLoggedIn && user && user.role=='delivery'  &&(
          <>
          <Link to="/delivery/orders" className="hover:underline">
              Delivery Orders
          </Link>
          <Link to="/delivery/earnings" className="hover:underline">
              Earnings 
          </Link>
          </>
          
        )}
        {
          isLoggedIn && user && user.role=='admin' && user.is_email_verified &&(
            <>
            <Link to="/admin/dashboard" className="hover:underline">
              Admin Dashboard
            </Link> 
            </>
          )
        }
        <Link to="/about" className="hover:underline">
               Explore My Work
        </Link>
      </div>

      {/* Right side - Username and Logout */}
      <div className="flex items-center space-x-4">
        {user && <span>Logged in as {user.username}</span>}
        {user && (
          <button onClick={handleLogout} className="hover:underline text-white">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
