import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders", {
        params: {
          page,
          limit,
        },
      });

      setOrders(response.data.items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h2>

                    <p className="mt-2 text-gray-600">
                      Total: ₹{order.total_amount}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Date:{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : order.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

export default Orders;