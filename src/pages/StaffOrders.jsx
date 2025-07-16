import React, { useEffect, useState } from "react";
import axios from "axios";

function StaffOrders() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateError,setUpdateError]=useState(null)

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [prevDriver, setPrevDriver] = useState(null);

  const token = localStorage.getItem("access_token");

  // Fetch drivers on mount (once)
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        if (!token) return;
        const res = await axios.get(`${API_URL}/api/drivers/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDrivers(res.data);
      } catch (error) {
        console.error("Failed to fetch drivers");
      }
    };
    fetchDrivers();
  }, [token]);

  // Fetch orders with filters
  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (!token) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterDate) params.date = filterDate;

      const ordersRes = await axios.get(
        `${API_URL}/orders/staff/orders/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setOrders(ordersRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response=await axios.patch(
        `${API_URL}/orders/staff/update/${orderId}/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
        )
      
        if('error' in response.data){
          setUpdateError(response.data.error)
          return;
        }
        setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
        );
      
    } catch(e) {
      console.log(e)
      alert("Failed to update status");
    }
  };

  // Open assign driver modal
  const openAssignModal = (orderId,driver) => {
    setSelectedOrderId(orderId);
    setSelectedDriverId("");
    setAssignModalOpen(true);
    setPrevDriver(driver)
  };

  // Assign driver API call
  const assignDriver = async () => {
    if (!selectedDriverId) {
      alert("Please select a driver");
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/orders/staff/update/${selectedOrderId}/`,
        { assigned_driver: selectedDriverId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrderId
            ? {
                ...order,
                status:'assigned',
                assigned_driver: selectedDriverId,
                assigned_driver_name:
                  drivers.find(
                    (d) => d.id === parseInt(selectedDriverId, 10)
                  )?.username || "",
              }
            : order
        )
      );
      setAssignModalOpen(false);
    } catch {
      alert("Failed to assign driver");
    }
  };
  const formatDate = (dateString) => {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(d.getFullYear()).slice(-2); // get last two digits of year
  return `${day}-${month}-${year}`;
    };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Staff Orders</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block mb-1 font-semibold">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="on_way">On Way</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Filter by Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>

        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Orders Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b font-semibold bg-gray-100">
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Total</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Assigned Driver</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan="6"
                className="p-6 text-center text-gray-500 font-medium"
              >
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map(
              ({
                id,
                username,
                created_at,
                total_price,
                status,
                assigned_driver_name,
              }) => (
                <tr key={id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{id}</td>
                  <td className="py-2 px-4">{username}</td>
                  <td className="py-2 px-4">{formatDate(created_at)}</td>
                  <td className="py-2 px-4">₹{total_price}</td>

                  <td className="py-2 px-4">
                    <select
                      value={status}
                      onChange={(e) => handleUpdateStatus(id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="on_way">On Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-2 px-4">
                    {assigned_driver_name || "Unassigned"}
                  </td>

                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => openAssignModal(id,assigned_driver_name)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Assign Driver
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
      {updateError && (
        <div>
          <span className="font-medium text-red-500">Error:</span>
          <span className="text-red-500">{updateError}</span>
        </div>
      )}
        
      {/* Assign Driver Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-80 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Assign Driver</h2>
            <select
              className="w-full border rounded p-2 mb-4"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">-- Select Driver --</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id} >
                  {driver.username} {driver.username==prevDriver}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={assignDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Assign
              </button>
              <button
                onClick={assignDriver}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700"
              >
                Remove {prevDriver}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffOrders;
