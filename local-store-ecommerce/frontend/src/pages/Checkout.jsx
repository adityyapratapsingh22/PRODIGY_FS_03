import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api } from "../api";

export default function Checkout() {
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customer: form,
      });
      clearCart();
      navigate(`/order-confirmation/${res.order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div className="stamp">🧺</div>
          <h3>Nothing to check out yet</h3>
          <Link to="/" className="btn btn-dark">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Checkout</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, alignItems: "start" }}>
        <form className="panel" onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 16 }}>Delivery details</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-grid">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" required value={form.name} onChange={update("name")} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={update("email")} />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone (optional)</label>
              <input id="phone" value={form.phone} onChange={update("phone")} />
            </div>
            <div className="field">
              <label htmlFor="address">Delivery address</label>
              <input id="address" required value={form.address} onChange={update("address")} />
            </div>
            <div className="field full">
              <label htmlFor="notes">Delivery notes (optional)</label>
              <textarea id="notes" rows={3} value={form.notes} onChange={update("notes")} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 18 }} type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : `Place order · $${total.toFixed(2)}`}
          </button>
        </form>

        <div className="receipt">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 14 }}>Order summary</h3>
          {items.map((item) => (
            <div className="receipt-row" key={item.productId}>
              <span>
                {item.qty} × {item.name}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr className="receipt-divider" />
          <div className="receipt-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="receipt-row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}</span>
          </div>
          <div className="receipt-row">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <hr className="receipt-divider" />
          <div className="receipt-row receipt-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
