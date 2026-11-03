import { useState } from "react";
import PasswordField from "./PasswordField.jsx";

function RegisterForm({ onSubmit, submitting }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        Name
        <input
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          placeholder="Your name"
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={150}
          required
          placeholder="you@example.com"
        />
      </label>

      <PasswordField
        autoComplete="new-password"
        placeholder="At least 8 characters"
        />

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export default RegisterForm;