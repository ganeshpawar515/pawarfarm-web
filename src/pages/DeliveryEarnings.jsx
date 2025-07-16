import axios from "axios";
import { useState, useEffect } from "react";

function DeliveryEarnings() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate totals
  const totalEarnings = earnings.reduce((sum, entry) => sum + parseFloat(entry.amount), 0);
  const deliveredCount = earnings.length;

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setError("Not logged in");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/payments/delivery-earnings/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setEarnings(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load earnings");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading earnings...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">My Earnings</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow">
          <div className="text-sm text-gray-600">Total Earnings</div>
          <div className="text-2xl font-bold text-green-700">₹{totalEarnings.toFixed(2)}</div>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded shadow">
          <div className="text-sm text-gray-600">Orders Delivered</div>
          <div className="text-2xl font-bold text-blue-700">{deliveredCount}</div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Paid At</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{entry.related_order_id || "-"}</td>
                <td className="py-2 px-4">₹{parseFloat(entry.amount).toFixed(2)}</td>
                <td className="py-2 px-4">
                  {entry.paid_at
                    ? new Date(entry.paid_at).toLocaleDateString()
                    : "Pending"}
                </td>
                <td className="py-2 px-4">
                  {entry.status === "paid" ? (
                    <span className="text-green-600 font-medium">Paid</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                </td>
              </tr>
            ))}
            {earnings.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No delivery earnings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DeliveryEarnings;
