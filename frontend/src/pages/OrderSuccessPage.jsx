import { Link, useLocation } from "react-router-dom";

function OrderSuccessPage() {
  const { state } = useLocation();
  const orderId = state?.orderId;
  const total = state?.total;

  return (
    <main className="order-success">
      <div className="order-success__icon" aria-hidden="true">
        ✓
      </div>

      <p className="eyebrow">THANK YOU</p>
      <h1>Your order is confirmed.</h1>

      <p>
        Your order has been successfully placed.
      </p>

      {orderId && (
        <div className="order-success__summary">
          <p>
            Order number: <strong>#{orderId}</strong>
          </p>

          {total != null && (
            <p>
              Total: <strong>₹{Number(total).toLocaleString("en-IN")}</strong>
            </p>
          )}
        </div>
      )}

      <Link className="order-success__link" to="/">
        Continue shopping <span>↗</span>
      </Link>
    </main>
  );
}

export default OrderSuccessPage;