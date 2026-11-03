import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoginForm from "../components/LoginForm.jsx";

function LoginPage() {
  const { user, loading, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      setSubmitting(true);
      await login(credentials);

      const destination = location.state?.from || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setError("");

    try {
      setLoggingOut(true);
      await logout();
    } catch (err) {
      setError(err.message || "Logout failed. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p>Checking your session...</p>
        </section>
      </main>
    );
  }

  if (user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <p className="eyebrow">WELCOME BACK</p>
          <h1>Hello, {user.name}!</h1>
          <p>You are signed in.</p>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <Link className="auth-link" to="/">
            Continue shopping
          </Link>

          <button
            className="auth-logout-button"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-back" to="/">
          ← FurniNest
        </Link>

        <p className="eyebrow">WELCOME BACK</p>
        <h1>Login</h1>
        <p className="auth-description">Sign in to your account.</p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <LoginForm onSubmit={handleSubmit} submitting={submitting} />

        <p className="auth-note">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;