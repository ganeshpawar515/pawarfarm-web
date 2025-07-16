import React, { useEffect, useState } from "react";
import axios from "axios";

function Cart() {
  const API_URL=import.meta.env.VITE_API_URL;
  const [cart, setCart] = useState(null); // cart order object with items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null); // to show spinner during update

  const token = localStorage.getItem("access_token");

  // Fetch cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/orders/get_cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart_data);
      } catch (err) {
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  // Handle quantity change for an item
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // minimum quantity is 1
    setUpdatingItemId(itemId);
    try {
      const response=await axios.put(
        `${API_URL}/orders/update_item/${itemId}/`,
        { quantity: newQuantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      // Update quantity locally after success
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.map((item) =>
          
          item.id === itemId ? { ...item, price: response.data.item.price,quantity: newQuantity } : item
        );
        // Calculate new total price
        const totalPrice = response.data.total_price
        return { ...prevCart, items: updatedItems, total_price: totalPrice };
      });
    } catch (err) {
      setError("Failed to update quantity");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Handle removing an item
  const handleRemoveItem = async (itemId) => {
    setUpdatingItemId(itemId);
    try {
      const response=await axios.delete(`${API_URL}/orders/remove_from_cart/${itemId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.filter((item) => item.id !== itemId);
        // Calculate new total price
        const totalPrice = response.data.total_price
        return { ...prevCart, items: updatedItems, total_price: totalPrice };
      });
    } catch (err) {
      setError("Failed to remove item");
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (loading) return <div className="p-6">Loading cart...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!cart || cart.items.length === 0)
    return <div className="p-6">Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Product</th>
            <th className="text-left py-2">Quantity</th>
            <th className="text-left py-2">Price</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map(({ id, product_name, quantity, price }) => (
            <tr key={id} className="border-b">
              <td className="py-2">{product_name}</td>
              <td className="py-2">
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  disabled={updatingItemId === id}
                  onChange={(e) =>
                    handleQuantityChange(id, parseInt(e.target.value))
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1"
                />
              </td>
              <td className="py-2">₹{Number(price).toFixed(2)}</td>

              <td className="py-2">
                <button
                  disabled={updatingItemId === id}
                  onClick={() => handleRemoveItem(id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold text-xl mb-6">
        Total: ₹{cart.total_price}
      </div>

      <button
        onClick={() => alert("Proceed to checkout (implement later)")}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
      >
        Checkout
      </button>
    </div>
  );
}

export default Cart;
