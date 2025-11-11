import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentList() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("access_token");

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/payments/api/payments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    await axios.post(
      `${API_URL}/payments/api/payments/${id}/mark_paid/`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading payments...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Driver Payments
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="py-3 px-4 font-semibold">Driver</th>
              <th className="py-3 px-4 font-semibold">Order ID</th>
              <th className="py-3 px-4 font-semibold">Amount</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Paid At</th>
              <th className="py-3 px-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition border-b text-center"
                >
                  <td className="py-3 px-4">{p.driver || "Unknown"}</td>
                  <td className="py-3 px-4">{p.related_order || "-"}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">
                    ₹{parseFloat(p.amount).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    {p.status === "paid" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Paid
                      </span>
                    ) : p.status === "failed" ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Failed
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.status === "pending" && (
                      <button
                        onClick={() => markPaid(p.id)}
                        className="bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-6 text-sm"
                >
                  No pending payments 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentList;
