function CheckoutForm({ onSubmit, total, submitting }) {
  return (
    <form className="checkout-form" onSubmit={onSubmit}>
      <h2>Delivery details</h2>

      <label>
        Full name
        <input
          name="customerName"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          placeholder="Enter Your Name"
        />
      </label>

      <label>
        Phone number
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          pattern="[0-9]{10}"
          title="Enter 10 Digits mobile number"
          required
          placeholder="Enter mobile number"
        />
      </label>

      <label>
        Delivery address
        <textarea
          name="address"
          autoComplete="street-address"
          rows={4}
          minLength={10}
          required
          placeholder="Enter Your Address"
        />
      </label>

      <button
        className="checkout-form__submit"
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? "Order Sending…"
          : `Place order · ₹${Number(total).toLocaleString("en-IN")}`}
      </button>
    </form>
  );
}

export default CheckoutForm;