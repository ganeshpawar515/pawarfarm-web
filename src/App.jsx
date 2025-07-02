import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import GetEmailOtp from './pages/GetEmailOtp';
import Cart from './pages/Cart';
import CustomerOrder from './pages/CustomerOrders';
import StaffOrders from './pages/StaffOrders';
import About from './pages/About';
import Navbar from './component/Navbar';


function App() {

  return (
     <Router>
      <Navbar />
      <Routes>
        <Route path="/cart"  element={<Cart />}/>
        <Route path="/about"  element={<About />}/>
        <Route path="/customer/orders"  element={<CustomerOrder />}/>
        <Route path="/staff/orders"  element={<StaffOrders />}/>
        <Route path="/get_email_otp" element={<GetEmailOtp />}/>
        <Route path="/verify_email" element={<VerifyEmail />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App
