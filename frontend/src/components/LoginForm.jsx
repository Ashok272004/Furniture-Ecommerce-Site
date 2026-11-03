import PasswordField from "./PasswordField.jsx";
function LoginForm({ onSubmit, submitting }) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>

      <PasswordField autoComplete="current-password" />

      <button type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;