import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ProductDetail() {
  const API_URL=import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState("");
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/products/detail/${id}`)
      .then((res) => {
        if (res.data.success) {
          setProduct(res.data.data);
          setLoading(false);
        } else {
          setError(res.data.error || "Failed to get product detail");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Network Error");
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async () => {
    setCartError(null);
    setMessage(null);
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCartError("Please log in to add product to cart");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/orders/add_to_cart/`,
        {
          items: [{ product: product.id, quantity: quantity }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Product added to cart successfully");
    } catch (error) {
      setCartError("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    setCartError(null);
    setMessage(null);
    const token = localStorage.getItem("access_token");

    if (!token) {
      setCartError("Please log in to place an order");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/orders/create_order/`,
        {
          items: [{ product: product.id, quantity: quantity }],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Order placed successfully!");
    } catch (error) {
      setCartError("Failed to place order");
    }
  };

  if (loading) return <div className="text-center p-10">Loading Product...</div>;
  if (error) return <div className="text-red-600 p-6">{error}</div>;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="md:w-1/2">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-sm text-gray-600 capitalize mb-2">
                Category: {product.category}
              </p>
              <p className="text-gray-700 mb-3">
                {product.description || "No description available."}
              </p>
              <p className="text-xl font-bold text-green-700 mb-1">₹{product.price}</p>
              <p className="text-sm text-gray-500 mb-2">
                Delivery in {product.delivery_time} day
                {product.delivery_time > 1 ? "s" : ""}
              </p>
              {product.is_available ? (
                <span className="text-green-600 font-semibold">✔ In Stock</span>
              ) : (
                <span className="text-red-600 font-semibold">✖ Out of Stock</span>
              )}
            </div>

            {/* Quantity and Actions */}
            {product.is_available && (
              <div className="mt-6">
                <label htmlFor="quantity" className="block text-gray-700 font-medium mb-1">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  min={1}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="bg-yellow-500 text-white font-semibold px-5 py-2 rounded hover:bg-yellow-600"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-green-600 text-white font-semibold px-5 py-2 rounded hover:bg-green-700"
                  >
                    Buy Now
                  </button>
                </div>
                {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
                {cartError && <p className="mt-4 text-red-600 font-medium">{cartError}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link to="/products" className="text-blue-600 hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
