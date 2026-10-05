import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put(`/cart/items/${itemId}`, {
        quantity,
      });

      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update quantity"
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);

      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to remove item"
      );
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");

      toast.success("Cart cleared");
      fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to clear cart"
      );
    }
  };

  const checkout = async () => {
    try {
      const response = await api.post(
        "/payments/create-checkout-session"
      );

      window.location.href = response.data.checkout_url;
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Checkout failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading cart...</p>
      </div>
    );
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Your Cart
          </h1>

          <p className="mt-3 text-gray-600">
            Your cart is empty.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Your Cart
        </h1>

        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.product.name}
                </h2>

                <p className="mt-1 text-gray-600">
                  ₹{item.product.price}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity - 1
                    )
                  }
                  disabled={item.quantity <= 1}
                  className="h-9 w-9 rounded border disabled:opacity-40"
                >
                  -
                </button>

                <span className="min-w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.quantity + 1
                    )
                  }
                  className="h-9 w-9 rounded border"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-3 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">
              Total
            </span>

            <span className="text-2xl font-bold text-blue-600">
              ₹{cart.total}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={clearCart}
              className="rounded-lg border border-red-300 px-5 py-3 font-medium text-red-600 hover:bg-red-50"
            >
              Clear Cart
            </button>

            <button
              onClick={checkout}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;