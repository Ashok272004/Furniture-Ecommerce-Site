import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { resolveImageUrl } from "../api/imageUrl.js";

function CartDrawer({ open, onClose }) {

  const navigate = useNavigate();
  const {
    items,
    cartCount,
    cartTotal,
    changeQuantity,
    removeFromCart,
  } = useCart();

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-drawer__header">
          <div>
            <p className="eyebrow">YOUR SELECTION</p>
            <h2>Your cart ({cartCount})</h2>
          </div>
          <button
            className="cart-drawer__close"
            type="button"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item__image">
                    {item.imageUrl ? (
                      <img src={resolveImageUrl(item.imageUrl)} alt={item.name} />
                    ) : (
                      <span>Furniture</span>
                    )}
                  </div>

                  <div className="cart-item__details">
                    <h3>{item.name}</h3>
                    <p>₹{Number(item.price).toLocaleString("en-IN")}</p>

                    <div className="cart-item__actions">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                      <button
                        className="cart-item__remove"
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        title="Remove item"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 7h16" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="m5 7 1 13h12l1-13M9 7V4h6v3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <strong className="cart-item__subtotal">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </article>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Subtotal</span>
                <strong>₹{cartTotal.toLocaleString("en-IN")}</strong>
              </div>
              <button
                type="button"
                className="cart-drawer__checkout"
                onClick={() => {
                    onClose();
                    navigate("/checkout");
                    }}
              >
                Continue to checkout <span>↗</span>
              </button>
              <p>Delivery and taxes are calculated at checkout.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
