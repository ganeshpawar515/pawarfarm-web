import axios from "axios";
import { useState, useEffect } from "react";

function DeliveryEarnings() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState({
    payments: [],
    total_earnings: 0,
    total_paid: 0,
    total_pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load earnings");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading earnings...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const { payments, total_earnings, total_paid, total_pending } = data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">My Earnings</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 border-l-4 border-blue-600 p-5 rounded-lg shadow">
          <div className="text-sm text-gray-700">Total Earnings</div>
          <div className="text-2xl font-bold text-blue-700">
            ₹{total_earnings.toFixed(2)}
          </div>
        </div>

        <div className="bg-green-100 border-l-4 border-green-600 p-5 rounded-lg shadow">
          <div className="text-sm text-gray-700">Amount Credited</div>
          <div className="text-2xl font-bold text-green-700">
            ₹{total_paid.toFixed(2)}
          </div>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-600 p-5 rounded-lg shadow">
          <div className="text-sm text-gray-700">Pending Payment</div>
          <div className="text-2xl font-bold text-yellow-700">
            ₹{total_pending.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
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
            {payments.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{entry.related_order || "-"}</td>
                <td className="py-3 px-4">₹{parseFloat(entry.amount).toFixed(2)}</td>
                <td className="py-3 px-4">
                  {entry.paid_at
                    ? new Date(entry.paid_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="py-3 px-4">
                  {entry.status === "paid" ? (
                    <span className="text-green-600 font-medium">Paid</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No earnings yet
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
