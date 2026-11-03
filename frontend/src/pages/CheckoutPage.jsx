import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrder } from "../api/ordersApi.js";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/paymentApi.js";
import CheckoutForm from "../components/CheckoutForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function finishOrder(savedOrder) {
    clearCart();

    navigate("/order-success", {
      state: {
        orderId: savedOrder.id,
        total: savedOrder.total,
      },
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const order = {
      customerName: formData.get("customerName"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    setSubmitting(true);

    try {
      if (paymentMethod === "COD") {
        const savedOrder = await createOrder({
          ...order,
          paymentMethod: "COD",
        });

        finishOrder(savedOrder);
        return;
      }

      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!keyId) {
        throw new Error("Razorpay Test Key ID is missing from frontend/.env.local.");
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Could not load Razorpay Checkout. Check your internet connection.");
      }

      const razorpayOrder = await createRazorpayOrder(order);

      const checkout = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "FurniNest",
        description: "Furniture order payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: order.customerName,
          email: user?.email || "",
          contact: order.phone,
        },
        theme: {
          color: getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim(),
        },
        handler: async (response) => {
          try {
            const savedOrder = await verifyRazorpayPayment({
              order,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            finishOrder(savedOrder);
          } catch (verificationError) {
            setError(
              verificationError.message ||
                "Payment verification failed. Please contact the store before trying to pay again."
            );
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      });

      checkout.on("payment.failed", (response) => {
        setError(
          response.error?.description || "Payment was not completed. Please try again."
        );
        setSubmitting(false);
      });

      checkout.open();
    } catch (err) {
      console.error(err);
      setError(err.message || "Your order could not be placed. Please try again.");
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <main className="checkout-page">
        <p>Checking your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="checkout-page">
        <h1>Sign in to checkout</h1>
        <p>Your cart will stay saved while you sign in.</p>
        <Link className="auth-link" to="/login" state={{ from: "/checkout" }}>
          Login to continue
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <h1>Your cart is empty</h1>
        <button type="button" onClick={() => navigate("/")}>
          Continue shopping
        </button>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <button
        className="checkout-page__back"
        type="button"
        onClick={() => navigate("/")}
      >
        ← Continue shopping
      </button>

      <h1>Checkout</h1>

      <section className="checkout-page__summary">
        <h2>Order summary</h2>

        {items.map((item) => (
          <div className="checkout-page__item" key={item.id}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <strong>
              ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
            </strong>
          </div>
        ))}

        <div className="checkout-page__total">
          <span>Total</span>
          <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
        </div>
      </section>

      <fieldset className="payment-methods" disabled={submitting}>
        <legend>Choose payment method</legend>

        <label className="payment-method">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          <span>
            <strong>Cash on Delivery</strong>
            <small>Pay when your furniture arrives</small>
          </span>
        </label>

        <label className="payment-method">
          <input
            type="radio"
            name="paymentMethod"
            value="RAZORPAY"
            checked={paymentMethod === "RAZORPAY"}
            onChange={() => setPaymentMethod("RAZORPAY")}
          />
          <span>
            <strong>Pay Online</strong>
            <small>Secure Razorpay Test Mode checkout</small>
          </span>
        </label>
      </fieldset>

      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}

      <CheckoutForm
        onSubmit={handleSubmit}
        total={cartTotal}
        submitting={submitting}
      />
    </main>
  );
}

export default CheckoutPage;
