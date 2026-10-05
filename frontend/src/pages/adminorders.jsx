import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load orders"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Admin Orders</h1>

      {orders.map((order) => (
        <div key={order.id}>
          <h3>Order #{order.id}</h3>
          <p>Total: ₹{order.total_amount}</p>
          <p>Status: {order.status}</p>
          <p>User ID: {order.user_id}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;