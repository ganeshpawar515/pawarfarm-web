import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes,Navigate, Route } from "react-router-dom";
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
import DeliveryOrders from './pages/DeliveryOrders';
import Navbar from './component/Navbar';
import DeliveryEarnings from './pages/DeliveryEarnings';
import StaffAddProducts from './pages/StaffAddProducts';  
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';

function App() {
  return (
     <Router>
      <Navbar />
      <Routes>  
        <Route path="/" element={<Navigate to="/about" />} />
        <Route path="/admin/users" element={<ManageUsers />}/>
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/cart"  element={<Cart />}/>
        <Route path="/delivery/orders"  element={<DeliveryOrders />}/>
        <Route path="/delivery/earnings"  element={<DeliveryEarnings />}/>
        <Route path="/about"  element={<About />}/>
        <Route path="/customer/orders"  element={<CustomerOrder />}/>
        <Route path="/staff/orders"  element={<StaffOrders />}/>
        <Route path="/staff/add-products"  element={<StaffAddProducts />}/>
        <Route path="/get_email_otp" element={<GetEmailOtp />}/>
        <Route path="/verify_email" element={<VerifyEmail />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}

export default App
