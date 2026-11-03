import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authApi.js";
import RegisterForm from "../components/RegisterForm.jsx";

function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [registeredName, setRegisteredName] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const userDetails = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      setSubmitting(true);
      const user = await registerUser(userDetails);
      setRegisteredName(user.name);
    } catch (err) {
      setError(err.message || "Unable to create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      {registeredName ? (
        <section className="auth-card">
          <p className="eyebrow">WELCOME</p>
          <h1>Welcome, {registeredName}!</h1>
          <p>Your account has been created successfully..</p>
          <Link className="auth-link" to="/">
           Continue Shopping
          </Link>
        </section>
      ) : (
        <section className="auth-card">
          <Link className="auth-back" to="/">← FurniNest</Link>
          <p className="eyebrow">JOIN FURNINEST</p>
          <h1>Create account</h1>
          <p className="auth-description">
            Enter your details to create an account.
          </p>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <RegisterForm
            onSubmit={handleSubmit}
            submitting={submitting}
          />

          <p className="auth-note">
           Already have an account? Log in here.
          </p>
        </section>
      )}
    </main>
  );
}

export default RegisterPage;