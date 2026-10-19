
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  // Supports both relative image paths and absolute image URLs.
  const getImageUrl = (image) => {
    if (!image) return null;

    try {
      return new URL(image, API_URL).href;
    } catch {
      return image;
    }
  };

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Fetch cart
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
        setError("Unable to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [API_URL, token]);

  // Update quantity
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1 || !Number.isInteger(newQuantity)) return;
    if (updatingItemId !== null || checkingOut) return;

    const currentItem = cart?.items.find((item) => item.id === itemId);
    if (!currentItem || currentItem.quantity === newQuantity) return;

    setUpdatingItemId(itemId);
    setError(null);

    try {
      const response = await axios.put(
        `${API_URL}/orders/update_item/${itemId}/`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: newQuantity,
                price: response.data.item.price,
              }
            : item
        ),
        total_price: response.data.total_price,
      }));
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to update quantity."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Remove item
  const handleRemoveItem = async (itemId) => {
    if (updatingItemId !== null || checkingOut) return;

    setUpdatingItemId(itemId);
    setError(null);

    try {
      const response = await axios.delete(
        `${API_URL}/orders/remove_from_cart/${itemId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.id !== itemId),
        total_price: response.data.total_price,
      }));
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to remove this item."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!cart?.items?.length || checkingOut || updatingItemId !== null) {
      return;
    }

    setCheckingOut(true);
    setError(null);

    try {
      await axios.post(
        `${API_URL}/orders/checkout_cart/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/customer/orders");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Checkout failed. Please try again."
      );
    } finally {
      setCheckingOut(false);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
          <p className="text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cart || !cart.items?.length) {
    return (
      <div className="min-h-[75vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-4xl">
            🛒
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={() => navigate("/")}
            className="mt-7 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-5 text-sm font-medium text-gray-500 hover:text-green-700"
          >
            ← Continue shopping
          </button>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Shopping Cart
              </h1>
              <p className="mt-2 text-gray-500">
                Review your items before placing your order.
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
              {cart.items.length}{" "}
              {cart.items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="font-bold"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

          {/* Cart items */}
          <section className="space-y-4 lg:col-span-2">
            <div className="hidden grid-cols-[minmax(0,1fr)_110px_110px] gap-4 px-5 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:grid">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>

            {cart.items.map((item) => {
              const isUpdating = updatingItemId === item.id;
              const imageUrl = getImageUrl(item.product_image);

              return (
                <article
                  key={item.id}
                  className={`relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition sm:p-5 ${
                    isUpdating ? "opacity-70" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_110px_110px] sm:items-center sm:gap-4">

                    {/* Product details */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-28 sm:w-28">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="break-words text-base font-semibold text-gray-900 sm:text-lg">
                          {item.product_name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          ₹
                          {formatPrice(
                            Number(item.price) / Math.max(item.quantity, 1)
                          )}{" "}
                          per item
                        </p>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={updatingItemId !== null || checkingOut}
                          className="mt-3 text-sm font-medium text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? "Updating..." : "✕ Remove"}
                        </button>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between sm:justify-center">
                      <span className="text-sm text-gray-500 sm:hidden">
                        Quantity
                      </span>

                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.product_name} quantity`}
                          disabled={
                            updatingItemId !== null ||
                            checkingOut ||
                            item.quantity <= 1
                          }
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="h-10 w-9 text-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.product_name} quantity`}
                          disabled={updatingItemId !== null || checkingOut}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="h-10 w-9 text-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line subtotal */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                      <span className="text-sm text-gray-500 sm:hidden">
                        Subtotal
                      </span>

                      <span className="text-base font-bold text-gray-900">
                        ₹{formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}

            {updatingItemId !== null && (
              <p className="text-sm text-gray-500">
                Updating your cart...
              </p>
            )}
          </section>

          {/* Order summary */}
          <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between gap-3 text-sm text-gray-600">
                <span>Items ({cart.items.length})</span>
                <span className="font-medium text-gray-900">
                  {cart.items.reduce(
                    (sum, item) => sum + Number(item.quantity),
                    0
                  )}{" "}
                  units
                </span>
              </div>

              <div className="flex justify-between gap-3 text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{formatPrice(cart.total_price)}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-green-700">
                    ₹{formatPrice(cart.total_price)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Final charges, including any delivery fees, are subject to
                  your checkout rules.
                </p>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={
                checkingOut ||
                updatingItemId !== null ||
                cart.items.length === 0
              }
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checkingOut ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Processing...
                </>
              ) : (
                <>Proceed to Checkout <span>→</span></>
              )}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>🔒</span>
              <span>Secure order processing</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
