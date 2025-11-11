import React, { useState } from "react";
import axios from "axios";

function OrderDetail() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrderDetail = async () => {
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/orders/detail/${orderId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
      setError("Order not found");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Order Detail</h2>

      {/* Search Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="number"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={fetchOrderDetail}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {order && (
        <div className="bg-white p-5 shadow rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">Order #{order.id}</h3>

          <div className="space-y-1">
            <p><strong>Customer:</strong> {order.customer_name} ({order.customer_email})</p>
            <p><strong>Driver:</strong> {order.driver_name || "Not Assigned"}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Delivered At:</strong> {order.delivered_at || "Not Delivered"}</p>
            <p><strong>Payment Mode:</strong> {order.payment_mode || "-"}</p>
            <p><strong>Paid:</strong> {order.is_paid ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Total Price:</strong> ₹{order.total_price}</p>
          </div>

          <h4 className="text-lg font-semibold mt-4">Items</h4>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Qty</th>
                <th className="py-2 px-3">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="text-center border-t">
                  <td className="py-2 px-3">{item.product_name}</td>
                  <td className="py-2 px-3">{item.quantity}</td>
                  <td className="py-2 px-3">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
