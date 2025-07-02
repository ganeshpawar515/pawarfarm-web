import { useEffect, useState } from "react";
import axios from "axios";

function CustomerOrder() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cancelingId, setCancelingId] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState([]); // to track dropdowns

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/orders/customer/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (err) {
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleCancel = async (orderId) => {
    setCancelingId(orderId);
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${API_URL}/orders/cancel/${orderId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "canceled" } : o
        )
      );
    } catch {
      setError("Failed to cancel order.");
    } finally {
      setCancelingId(null);
    }
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (loading) return <div className="p-6">Loading orders...</div>;
  if (!orders || orders.length === 0)
    return <div className="p-6">You have no orders yet.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map(({ id, created_at, total_price, status, items }) => (
          <div key={id} className="border rounded-lg shadow-sm">
            <div className="flex justify-between items-center bg-gray-50 px-4 py-3">
              <div>
                <p className="text-lg font-semibold">Order #{id}</p>
                <p className="text-sm text-gray-600">
                  {new Date(created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${statusColor[status] || "bg-gray-100 text-gray-700"}`}
                >
                  {status}
                </span>
                {status === "pending" && (
                  <button
                    disabled={cancelingId === id}
                    onClick={() => handleCancel(id)}
                    className="text-sm text-red-600 hover:underline disabled:text-gray-400"
                  >
                    {cancelingId === id ? "Canceling..." : "Cancel"}
                  </button>
                )}
                <button
                  onClick={() => toggleExpand(id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {expandedOrders.includes(id) ? "Hide Items" : "Show Items"}
                </button>
              </div>
            </div>

            {expandedOrders.includes(id) && (
              <div className="px-6 py-4 bg-white border-t">
                {items && items.length > 0 ? (
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>
                        <span>₹{parseFloat(item.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No items found in this order.</p>
                )}
                <div className="mt-4 text-right font-semibold text-lg">
                  Total: ₹{parseFloat(total_price).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerOrder;
