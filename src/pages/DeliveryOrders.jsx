import axios from "axios";
import { useState, useEffect } from "react";

function DeliveryOrders() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [updateError, setUpdateError] = useState(null);
  const [statusFilter, setStatusFilter] = useState([
    "assigned",
    "on_way",

  ]); // default: all checked

  const statusOptions = [
    { value: "assigned", label: "Assigned" },
    { value: "on_way", label: "Left for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const handleCheckboxChange = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredOrders = orders.filter((order) =>
    statusFilter.includes(order.status)
  );
  const fetchOrders=()=>{
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }
    axios
      .get(`${API_URL}/orders/delivery/orders/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("data", response.data);
        setOrders(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
  }
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (order_id, newStatus) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Not logged in");
      return;
    }

    axios
      .patch(
        `${API_URL}/orders/delivery/update/order/${order_id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if ("error" in response.data) {
          console.log(response.data.error);
          setUpdateError(response.data.error);
          return;
        }
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === order_id ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch(() => {
        setError("Failed to update order status");
      });
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders for Delivery</h2>
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Status:</label>
        {statusOptions.map((option) => (
          <label key={option.value} className="mr-4">
            <input
              type="checkbox"
              checked={statusFilter.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              className="mr-1"
            />
            {option.label}
          </label>
        ))}
      </div>
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg shadow-md p-4 mb-6 bg-white"
        >
          <div className="font-medium mb-2">
            Delivery for: <span className="text-blue-600">{order.username}</span>
          </div>
          <div className="mb-2">Total Amount: ₹{order.total_price}</div>

          <div className="mb-3">
            <h4 className="font-semibold mb-1">Delivery Items:</h4>
            {order.items.map((item) => (
              <div key={item.id} className="pl-2 border-l-2 border-gray-300 mb-2">
                <p>Product: {item.product_name}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
          </div>
          <div>
            {order.is_paid && <span className="font-medium text-green-500">Paid</span>}
            {!order.is_paid && <span className="font-medium text-red-500">UnPaid</span>}
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Update Status:</label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
              className="border rounded px-3 py-2"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className="font-medium">Current Status:</span>{" "}
            <span className="text-green-700">{order.status}</span>
          </div>
          {updateError && (
            <div>
              <span className="font-medium text-red-500">Error:</span>{" "}
              <span className="text-red-500">{updateError}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DeliveryOrders;
