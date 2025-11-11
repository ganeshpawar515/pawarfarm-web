import axios from "axios";
import { useState, useEffect } from "react";

function DeliveryOrders() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [updateError, setUpdateError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpModalForOrder, setOtpModalForOrder] = useState(null);
  const [otpInput, setOtpInput] = useState("");

  const [statusFilter, setStatusFilter] = useState([
    "assigned",
    "on_way",
  ]);

  const statusOptions = [
    { value: "assigned", label: "Assigned" },
    { value: "on_way", label: "Left for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const token = localStorage.getItem("access_token");

  const fetchOrders = () => {
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/orders/delivery/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCheckboxChange = (status) => {
    setError(null)
    setOtpError(null)
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredOrders = orders.filter((order) =>
    statusFilter.includes(order.status)
  );

  const handleStatusChange = (order_id, newStatus) => {
    if (!token) return setError("Not logged in");

    axios
      .patch(
        `${API_URL}/orders/delivery/update/order/${order_id}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        if (res.data.error) return setUpdateError(res.data.error);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === order_id ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch(() => setUpdateError("Failed to update order status"));
  };

  const handleGenerateOtp = async (order_id) => {
    setSendingOtp(true);
    setOtpError(null);

    try {
      const response=await axios.post(
        `${API_URL}/orders/delivery/generate_otp/${order_id}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("OTP sent to customer's email ✅");
      setOtpModalForOrder(order_id);
    } catch (err) {
      console.log(err)
      
      setOtpError(err.response.data.error ||"Failed to generate OTP ❌");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleConfirmDelivery = async (order_id) => {
    if (!otpInput) return setOtpError("Enter OTP");

    try {
      await axios.post(
        `${API_URL}/orders/delivery/confirm_otp/${order_id}/`,
        { otp: otpInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order marked as Delivered ✅");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === order_id ? { ...order, status: "delivered" } : order
        )
      );
      setOtpModalForOrder(null);
      setOtpInput("");
    } catch (err) {
      setOtpError("Invalid OTP ❌");
    }
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders for Delivery</h2>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Status:</label>
        {statusOptions.map((opt) => (
          <label key={opt.value} className="mr-4">
            <input
              type="checkbox"
              checked={statusFilter.includes(opt.value)}
              onChange={() => handleCheckboxChange(opt.value)}
              className="mr-1"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg shadow-md p-4 mb-6 bg-white"
        >
          <div className="font-medium mb-2">
            Delivery for:{" "}
            <span className="text-blue-600">{order.username}</span>
          </div>

          <div className="mb-2">Total Amount: ₹{order.total_price}</div>

          <h4 className="font-semibold mb-1">Items:</h4>
          {order.items.map((item) => (
            <div key={item.id} className="pl-3 border-l ml-2 mb-2">
              <p>{item.product_name}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          ))}

          <div className="font-medium mb-2">
            {order.is_paid ? "✅ Paid" : "❌ Unpaid"}
          </div>

          {/* Status Update */}
          <select
            disabled={order.status === "delivered" || order.status==="cancelled"}
            value={order.status}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
            className="border rounded px-3 py-2 mr-3"
          >
            {statusOptions.map((opt) => {
              if(opt.value!=="delivered"){
              return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
              )}
              })}
          </select>

          {/* Generate OTP */}
          {order.status !== "delivered" && order.status!=="cancelled" && (
            <button
              onClick={() => handleGenerateOtp(order.id)}
              className="px-3 py-2 bg-blue-600 text-white rounded"
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending..." : "Generate OTP"}
            </button>
          )}

          {/* OTP Section */}
          {otpModalForOrder === order.id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="border px-3 py-2 rounded"
              />
              <button
                onClick={() => handleConfirmDelivery(order.id)}
                className="px-4 py-2 bg-green-700 text-white rounded"
              >
                Confirm Delivery
              </button>
            </div>
          )}

          {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
        </div>
      ))}
    </div>
  );
}

export default DeliveryOrders;
