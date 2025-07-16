import React, { useState } from "react";
import axios from "axios";

const CATEGORY_CHOICES = [
  { value: "milk", label: "Milk" },
  { value: "eggs", label: "Eggs" },
  { value: "fertilizer", label: "Organic Fertilizer" },
  { value: "pickle", label: "Pickle" },
  { value: "vegetable", label: "Vegetable" },
  { value: "fruit", label: "Fruit" },
  { value: "dairy", label: "Milk Product" },
  { value: "other", label: "Other" },
];

function StaffAddProducts() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    delivery_time: 7,
    is_available: true,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitting(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("You must be logged in as staff to add products.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("delivery_time", form.delivery_time);
    formData.append("is_available", form.is_available);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await axios.post(
        `${API_URL}/products/create/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        setMessage("Product created successfully!");
        setForm({
          name: "",
          description: "",
          price: "",
          category: "",
          image: null,
          delivery_time: 7,
          is_available: true,
        });
      } else {
        setError(res.data.message || "Failed to create product.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error
          ? JSON.stringify(err.response.data.error)
          : "Failed to create product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Add New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block mb-2 font-medium">Product Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-medium">Price (₹)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-medium">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option value="">Select Category</option>
          {CATEGORY_CHOICES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full mb-4"
        />

        <label className="block mb-2 font-medium">Delivery Time (days)</label>
        <input
          type="number"
          name="delivery_time"
          value={form.delivery_time}
          onChange={handleChange}
          min="1"
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-medium flex items-center">
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
            className="mr-2"
          />
          Available for Sale
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
      {message && (
        <div className="mt-4 text-green-700 font-medium">{message}</div>
      )}
      {error && (
        <div className="mt-4 text-red-600 font-medium">{error}</div>
      )}
    </div>
  );
}

export default StaffAddProducts;