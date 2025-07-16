import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  const [orderReport, setOrderReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const [productsRes, ordersRes, usersRes, reportRes] = await Promise.all([
          axios.get(`${API_URL}/products/get/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/orders/staff/orders/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/user/list/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/orders/order-report/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          products: productsRes.data.data?.length || 0,
          orders: ordersRes.data?.length || 0,
          users: usersRes.data?.length || 0,
        });

        setOrderReport(reportRes.data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-green-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {stats.products}
          </div>
          <div className="text-lg font-semibold mb-4">Products</div>
          <Link to="/staff/add-products" className="text-green-700 hover:underline">
            Add Product
          </Link>
        </div>

        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stats.orders}
          </div>
          <div className="text-lg font-semibold mb-4">Orders</div>
          <Link to="/staff/orders" className="text-blue-700 hover:underline">
            View Orders
          </Link>
        </div>

        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-yellow-600 mb-2">
            {stats.users}
          </div>
          <div className="text-lg font-semibold mb-4">Users</div>
          <Link to="/admin/users" className="text-yellow-700 hover:underline">
            Manage Users
          </Link>
        </div>
      </div>

      {/* Order Report Section */}
      {orderReport && (
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Order Report</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-gray-600">Total Orders</div>
              <div className="text-xl font-bold">{orderReport.total_orders}</div>
            </div>
            <div>
              <div className="text-gray-600">Delivered</div>
              <div className="text-xl font-bold">{orderReport.delivered_orders}</div>
            </div>
            <div>
              <div className="text-gray-600">Pending</div>
              <div className="text-xl font-bold">{orderReport.pending_orders}</div>
            </div>
            <div>
              <div className="text-gray-600">Assigned</div>
              <div className="text-xl font-bold">{orderReport.assigned_orders}</div>
            </div>
            <div>
              <div className="text-gray-600">On Way</div>
              <div className="text-xl font-bold">{orderReport.on_way_orders}</div>
            </div>
            <div>
              <div className="text-gray-600">Cancelled</div>
              <div className="text-xl font-bold">{orderReport.cancelled_orders}</div>
            </div>
            <div>
              <div className="text-gray-600">Total Revenue</div>
              <div className="text-xl font-bold">
                ₹{(orderReport.total_revenue || 0).toFixed(2)}
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Orders in Last 7 Days</h3>
          <div className="flex flex-wrap gap-4">
            {orderReport.orders_per_day?.map((d) => (
              <div
                key={d.date}
                className="bg-gray-100 rounded px-3 py-2 text-center"
              >
                <div className="text-xs text-gray-500">{d.date}</div>
                <div className="font-bold">{d.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/staff/add-products"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Product
          </Link>
          <Link
            to="/staff/orders"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Orders
          </Link>
          <Link
            to="/admin/users"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
