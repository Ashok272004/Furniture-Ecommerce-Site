import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  cancelMyOrder,
  getMyOrderItems,
  getMyOrders,
} from "../api/ordersApi.js";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { resolveImageUrl } from "../api/imageUrl.js";

function formatDate(date) {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

const ORDER_STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

function OrderTracker({ status }) {
  const currentStatus = (status || "PLACED").toUpperCase();

  if (currentStatus === "CANCELLED") {
    return <p className="order-cancelled">Order cancelled</p>;
  }

  const currentIndex = ORDER_STEPS.indexOf(currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="order-tracker">
      {ORDER_STEPS.map((step, index) => (
        <div
          className={`order-tracker__step ${
            index <= activeIndex ? "order-tracker__step--active" : ""
          }`}
          key={step}
        >
          <span className="order-tracker__circle">
            {index < activeIndex ? "✓" : index + 1}
          </span>
          <span className="order-tracker__label">
            {step.charAt(0) + step.slice(1).toLowerCase()}
          </span>
        </div>
      ))}
    </div>
  );
}

function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [loadingItemsOrderId, setLoadingItemsOrderId] = useState(null);
  const [itemsError, setItemsError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setOrders([]);
      setLoadingOrders(false);
      return;
    }

    let isActive = true;

    setLoadingOrders(true);
    setError("");

    getMyOrders()
      .then((data) => {
        if (isActive) {
          setOrders(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err.message || "Could not load your orders.");
        }
      })
      .finally(() => {
        if (isActive) {
          setLoadingOrders(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user, authLoading]);

  async function handleToggleItems(orderId) {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setItemsError("");
      return;
    }

    setExpandedOrderId(orderId);
    setItemsError("");

    if (orderItems[orderId]) {
      return;
    }

    try {
      setLoadingItemsOrderId(orderId);

      const items = await getMyOrderItems(orderId);

      setOrderItems((currentItems) => ({
        ...currentItems,
        [orderId]: Array.isArray(items) ? items : [],
      }));
    } catch (err) {
      setItemsError(err.message || "Could not load order items.");
    } finally {
      setLoadingItemsOrderId(null);
    }
  }

  async function handleCancelOrder(orderId) {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmed) return;

  setCancellingOrderId(orderId);
  setError("");

  try {
    const updatedOrder = await cancelMyOrder(orderId);

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: updatedOrder.status || "CANCELLED" }
          : order
      )
    );
  } catch (err) {
    setError(err.message || "Could not cancel this order.");
  } finally {
    setCancellingOrderId(null);
  }
}

  return (
    <>
      <Navbar />

      <main className="my-orders-page">
        <section className="my-orders-hero">
          <div>
            <p className="my-orders-eyebrow">YOUR ACCOUNT</p>
            <h1>My Orders</h1>
            <p className="my-orders-subtitle">
              Track your purchases and see your order history.
            </p>
          </div>

          {user && !loadingOrders && (
            <div className="my-orders-count">
              <span>{orders.length}</span>
              <span>{orders.length === 1 ? "Order" : "Orders"}</span>
            </div>
          )}
        </section>

        {authLoading && (
          <section className="my-orders-state">
            <span className="my-orders-loader" />
            <p>Checking your account...</p>
          </section>
        )}

        {!authLoading && !user && (
          <section className="my-orders-state">
            <div className="my-orders-state__icon" aria-hidden="true">
              ♙
            </div>
            <h2>Sign in to view your orders</h2>
            <p>Your purchases will be listed here after you sign in.</p>
            <Link className="my-orders-primary-button" to="/login">
              Login to your account
            </Link>
          </section>
        )}

        {user && loadingOrders && (
          <section className="my-orders-state">
            <span className="my-orders-loader" />
            <p>Loading your orders...</p>
          </section>
        )}

        {user && !loadingOrders && error && (
          <section className="my-orders-state my-orders-state--error">
            <div className="my-orders-state__icon" aria-hidden="true">
              !
            </div>
            <h2>Orders could not be loaded</h2>
            <p role="alert">{error}</p>
            <button
              className="my-orders-primary-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </section>
        )}

        {user && !loadingOrders && !error && orders.length === 0 && (
          <section className="my-orders-state">
            <div className="my-orders-state__icon" aria-hidden="true">
              ⌂
            </div>
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
            <Link className="my-orders-primary-button" to="/">
              Browse furniture
            </Link>
          </section>
        )}

        {user && !loadingOrders && !error && orders.length > 0 && (
          <section className="my-orders-list" aria-label="Your orders">
            {orders.map((order) => (
              <article className="my-order-card" key={order.id}>
                <div className="my-order-card__header">
                  <div>
                    <p className="my-order-card__label">ORDER NUMBER</p>
                    <h2>#{order.id}</h2>
                  </div>

                  <span className="my-order-status">
                    {order.status || "PLACED"}
                  </span>
                </div>

                <OrderTracker status={order.status} />

                {["PLACED", "CONFIRMED"].includes(
                String(order.status || "").toUpperCase()
                ) && (
                <button
                    className="my-order-cancel-button"
                    type="button"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrderId === order.id}
                >
                    {cancellingOrderId === order.id ? "Cancelling..." : "Cancel order"}
                </button>
                )}

                <div className="my-order-card__summary">
                  <div>
                    <span className="my-order-card__label">ORDER TOTAL</span>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>

                  <div>
                    <span className="my-order-card__label">ORDER DATE</span>
                    <strong>{formatDate(order.createdAt)}</strong>
                  </div>

                  <div className="my-order-payment">
                    <span className="my-order-card__label">PAYMENT</span>
                    <strong>
                      {order.paymentMethod === "RAZORPAY"
                        ? "Online payment"
                        : "Cash on delivery"}
                    </strong>
                    <span className="my-order-payment__status">
                      {order.paymentStatus === "PAID"
                        ? "Paid"
                        : order.paymentStatus === "DEMO_PAID"
                          ? "Demo paid"
                          : "Payment due on delivery"}
                    </span>
                  </div>
                </div>

                {order.address && (
                  <div className="my-order-card__delivery">
                    <span aria-hidden="true">⌖</span>
                    <div>
                      <span className="my-order-card__label">
                        DELIVERING TO
                      </span>
                      <p>{order.address}</p>
                    </div>
                  </div>
                )}

                <button
                  className="my-order-items-button"
                  type="button"
                  onClick={() => handleToggleItems(order.id)}
                  aria-expanded={expandedOrderId === order.id}
                >
                  {expandedOrderId === order.id ? "Hide items" : "View items"}
                  <span aria-hidden="true">
                    {expandedOrderId === order.id ? "−" : "+"}
                  </span>
                </button>

                {expandedOrderId === order.id && (
                  <div className="my-order-items">
                    {loadingItemsOrderId === order.id && (
                      <p>Loading items...</p>
                    )}

                    {itemsError && (
                      <p className="my-order-items__error" role="alert">
                        {itemsError}
                      </p>
                    )}

                    {!loadingItemsOrderId &&
                      !itemsError &&
                      (orderItems[order.id] || []).map((item, index) => (
                        <div
                        className="my-order-item"
                        key={item.id || `${order.id}-${index}`}
                        >
                        <img
                            className="my-order-item__image"
                            src={resolveImageUrl(item.imageUrl)}
                            alt={item.productName || "Furniture item"}
                            onError={(event) => {
                            event.currentTarget.style.display = "none";
                            }}
                        />

                        <div className="my-order-item__info">
                            {item.productId ? (
                              <Link
                                className="my-order-item__product-link"
                                to={`/products/${item.productId}`}
                              >
                                {item.productName || "Furniture item"}
                              </Link>
                            ) : (
                              <strong>{item.productName || "Furniture item"}</strong>
                            )}
                            {item.category && (
                              <span className="my-order-item__category">
                                {item.category}
                              </span>
                            )}
                            {item.description && (
                              <p className="my-order-item__description">
                                {item.description}
                              </p>
                            )}
                            <span>Quantity: {item.quantity}</span>
                            {item.productId && (
                              <Link
                                className="my-order-item__details-link"
                                to={`/products/${item.productId}`}
                              >
                                View product details <span aria-hidden="true">→</span>
                              </Link>
                            )}
                        </div>

                        <strong className="my-order-item__price">
                            {formatPrice(item.unitPrice)}
                        </strong>
                        </div>
                      ))}

                    {!loadingItemsOrderId &&
                      !itemsError &&
                      orderItems[order.id]?.length === 0 && (
                        <p>No item details are available for this order.</p>
                      )}
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default MyOrdersPage;
