import { Fragment } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../api/imageUrl.js";

function AdminOrderList({
  orders,
  loading,
  error,
  onStatusChange,
  updatingOrderId,
  onViewItems,
  expandedOrderId,
  orderItems,
  loadingOrderItemsId,
}) {
  if (loading) {
    return <p className="admin-empty">Loading orders...</p>;
  }

  if (error) {
    return (
      <p className="admin-empty admin-order-list__error" role="alert">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return <p className="admin-empty">No orders yet.</p>;
  }

  return (
    <div className="admin-order-list">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total</th>
            <th>Payment method</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Placed</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <Fragment key={order.id}>
              <tr>
                <td>
                  <span>#{order.id}</span>
                  <button
                    className="admin-order-view-button"
                    type="button"
                    onClick={() => onViewItems(order.id)}
                  >
                    {expandedOrderId === order.id ? "Hide items" : "View items"}
                  </button>
                </td>
                <td>{order.customerName}</td>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>₹{Number(order.total).toLocaleString("en-IN")}</td>
                <td>
                  {order.paymentMethod === "RAZORPAY"
                    ? "Online (Razorpay)"
                    : "Cash on delivery"}
                </td>
                <td>
                  <span
                    className={`admin-payment-status admin-payment-status--${
                      (order.paymentStatus || "pending").toLowerCase()
                    }`}
                  >
                    {order.paymentStatus === "PAID"
                      ? "Paid"
                      : order.paymentStatus === "DEMO_PAID"
                        ? "Demo paid"
                        : "Pending"}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-order-status-select"
                    value={order.status || "PLACED"}
                    onChange={(event) =>
                      onStatusChange(order.id, event.target.value)
                    }
                    disabled={updatingOrderId === order.id}
                  >
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>
              </tr>

              {expandedOrderId === order.id && (
                <tr key={`items-${order.id}`}>
                  <td colSpan={9} className="admin-order-items-cell">
                    {loadingOrderItemsId === order.id ? (
                      <p>Loading order items...</p>
                    ) : orderItems.length === 0 ? (
                      <p>No items found for this order.</p>
                    ) : (
                      <ul className="admin-order-items">
                        {orderItems.map((item) => (
                          <li key={item.id}>
                            <div className="admin-order-item__image-wrap">
                              {item.imageUrl ? (
                                <img
                                  className="admin-order-item__image"
                                  src={resolveImageUrl(item.imageUrl)}
                                  alt={item.productName || "Furniture item"}
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span>Furniture</span>
                              )}
                            </div>
                            <div className="admin-order-item__details">
                              <strong className="admin-order-item__name">
                                {item.productName} × {item.quantity}
                              </strong>
                              {item.category && (
                                <span className="admin-order-item__category">
                                  {item.category}
                                </span>
                              )}
                              {item.description && (
                                <p className="admin-order-item__description">
                                  {item.description}
                                </p>
                              )}
                              {item.productId && (
                                <Link to={`/products/${item.productId}`}>
                                  View product details →
                                </Link>
                              )}
                            </div>
                            <strong className="admin-order-item__price">
                              ₹{Number(item.unitPrice).toLocaleString("en-IN")} each
                            </strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrderList;
