import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

const STAGE_ICONS = { Placed: "🧾", Packed: "📦", "Out for Delivery": "🚲", Delivered: "🏡" };

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function lookup(id) {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await api.getOrder(id.trim());
      setOrder(res.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("id")) lookup(searchParams.get("id"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    lookup(orderId);
  }

  return (
    <div className="container page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Where's my order?</div>
          <h1>Track order</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 460, marginBottom: 28 }}>
        <input
          placeholder="e.g. HC-482913"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ flex: 1 }}
          aria-label="Order ID"
        />
        <button className="btn btn-dark" type="submit" disabled={loading}>
          {loading ? "Looking…" : "Track"}
        </button>
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {order && (
        <div className="panel" style={{ maxWidth: 640 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Order</div>
              <div className="price-tag">{order.id}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Placed</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 13.5 }}>
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="tracking">
            {order.tracking.map((step) => (
              <div
                key={step.stage}
                className={`tracking-step ${step.completed ? "completed" : ""} ${step.current ? "current" : ""}`}
              >
                <div className="tracking-dot">{STAGE_ICONS[step.stage]}</div>
                <div className="tracking-label">{step.stage}</div>
              </div>
            ))}
          </div>

          <hr className="receipt-divider" />

          <h4 style={{ marginTop: 16 }}>Items</h4>
          {order.items.map((item) => (
            <div className="receipt-row" key={item.productId} style={{ fontFamily: "var(--font-body)" }}>
              <span>
                {item.qty} × {item.name}
              </span>
              <span>${item.lineTotal.toFixed(2)}</span>
            </div>
          ))}
          <hr className="receipt-divider" />
          <div className="receipt-row receipt-total" style={{ fontFamily: "var(--font-body)" }}>
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>

          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 12 }}>
            Delivering to {order.customer.address}
          </p>
        </div>
      )}
    </div>
  );
}
