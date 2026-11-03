import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import CartDrawer from "./CartDrawer.jsx";
import ThemePicker from "./ThemePicker.jsx";

function Navbar() {
  const { cartCount } = useCart();
  const { user, loading, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "Customer";

  function closeMenu() {
    setMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <>
      <div className="navbar-shell">
      <header className="navbar">
        <Link className="navbar__brand" to="/" aria-label="FurniNest home">
          <span className="navbar__logo">F</span>
          <span>
            Furni<span className="navbar__brand-light">Nest</span>
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <a href="/#shop-categories-title">Shop</a>
          <a href="/#about">About</a>
          <a href="/#contact">Contact</a>
          {user?.role === "ADMIN" && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="navbar__actions">
          <ThemePicker />
          <button
            className="navbar__cart"
            type="button"
            onClick={() => {
              closeMenu();
              setCartOpen(true);
            }}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <span aria-hidden="true">🛒</span>
            <span>Cart</span>
            <span className="navbar__cart-count">{cartCount}</span>
          </button>

          <div className="navbar__auth-actions">
            {!loading && user ? (
              <>
                {user.role !== "ADMIN" && (
                  <Link className="navbar__login-button" to="/my-orders">
                    My Orders
                  </Link>
                )}

                <span className="navbar__user-name" title={displayName} aria-label={`Signed in as ${displayName}`}>
                  <span className="navbar__user-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
                  <span className="navbar__user-label">{displayName}</span>
                </span>

                <button
                  className="navbar__register-button"
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              !loading && (
                <>
                  <Link className="navbar__login-button" to="/login">
                    Login
                  </Link>
                  <Link className="navbar__register-button" to="/register">
                    Register
                  </Link>
                </>
              )
            )}
          </div>

          <button
            className="navbar__menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="navbar-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="navbar__mobile-menu" id="navbar-mobile-menu">
          <div className="navbar__mobile-theme">
            <ThemePicker />
          </div>
          <nav className="navbar__mobile-links" aria-label="Mobile navigation">
            <Link to="/" onClick={closeMenu}>Home</Link>
            <a href="/#shop-categories-title" onClick={closeMenu}>Shop</a>
            <a href="/#about" onClick={closeMenu}>About</a>
            <a href="/#contact" onClick={closeMenu}>Contact</a>
            {user?.role === "ADMIN" && (
              <Link to="/admin" onClick={closeMenu}>Admin dashboard</Link>
            )}
            {user && user.role !== "ADMIN" && (
              <Link to="/my-orders" onClick={closeMenu}>My Orders</Link>
            )}
          </nav>

          {!loading && (
            <div className="navbar__mobile-auth">
              {user ? (
                <>
                  <span className="navbar__user-name" title={displayName} aria-label={`Signed in as ${displayName}`}>
                  <span className="navbar__user-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
                  <span className="navbar__user-label">{displayName}</span>
                </span>
                  <button
                    className="navbar__register-button"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="navbar__login-button" to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link className="navbar__register-button" to="/register" onClick={closeMenu}>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;



