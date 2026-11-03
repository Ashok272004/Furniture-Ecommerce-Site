import { useEffect, useState } from "react";
import {
  getOrderItems,
  getOrders,
  updateOrderStatus,
} from "../api/ordersApi.js";
import AdminOrderList from "../components/AdminOrderList.jsx";
import AdminShell from "../components/AdminShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingOrderItemsId, setLoadingOrderItemsId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    let active = true;

    getOrders()
      .then((data) => {
        if (active) setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setOrdersError(err.message || "Could not load orders.");
      })
      .finally(() => {
        if (active) setLoadingOrders(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  async function handleOrderStatusChange(orderId, status) {
    setOrdersError("");
    setSuccess("");

    try {
      setUpdatingOrderId(orderId);
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) => order.id === orderId ? updatedOrder : order)
      );
      setSuccess(`Order #${orderId} status updated.`);
    } catch (err) {
      setOrdersError(err.message || "Could not update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  async function handleViewItems(orderId) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderItems([]);
      return;
    }

    setExpandedOrderId(orderId);
    setOrderItems([]);
    setOrdersError("");
    setLoadingOrderItemsId(orderId);

    try {
      const items = await getOrderItems(orderId);
      setOrderItems(Array.isArray(items) ? items : []);
    } catch (err) {
      setOrdersError(err.message || "Could not load order items.");
    } finally {
      setLoadingOrderItemsId(null);
    }
  }

  return (
    <AdminShell title="Customer orders">
      {success && <p className="admin-success" role="status">{success}</p>}
      <AdminOrderList
        orders={orders}
        loading={loadingOrders}
        error={ordersError}
        onStatusChange={handleOrderStatusChange}
        updatingOrderId={updatingOrderId}
        onViewItems={handleViewItems}
        expandedOrderId={expandedOrderId}
        orderItems={orderItems}
        loadingOrderItemsId={loadingOrderItemsId}
      />
    </AdminShell>
  );
}

export default AdminOrdersPage;
