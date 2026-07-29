import { useState } from "react";
import { api } from "../api";

const TOPICS = ["General question", "Order issue", "Delivery", "Product question", "Feedback"];

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.sendSupportMessage(form);
      setTicket(res.ticket);
      setForm({ name: "", email: "", topic: TOPICS[0], message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page">
      <div className="section-heading">
        <div>
          <div className="eyebrow">We're here to help</div>
          <h1>Customer support</h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" }}>
        <div className="panel">
          {ticket ? (
            <div className="alert alert-success" style={{ marginBottom: 0 }}>
              Thanks, {ticket.name.split(" ")[0]} — your ticket <strong>{ticket.id}</strong> is open. We reply within
              one business day at {ticket.email}.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="sname">Name</label>
                  <input id="sname" required value={form.name} onChange={update("name")} />
                </div>
                <div className="field">
                  <label htmlFor="semail">Email</label>
                  <input id="semail" type="email" required value={form.email} onChange={update("email")} />
                </div>
                <div className="field full">
                  <label htmlFor="stopic">Topic</label>
                  <select id="stopic" value={form.topic} onChange={update("topic")}>
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="smessage">How can we help?</label>
                  <textarea id="smessage" rows={5} required value={form.message} onChange={update("message")} />
                </div>
              </div>
              <button className="btn btn-dark" style={{ marginTop: 16 }} type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        <div className="panel">
          <h4>Other ways to reach us</h4>
          <p style={{ fontSize: 14 }}>📞 (555) 019-4420 — Mon–Sat, 8am–6pm</p>
          <p style={{ fontSize: 14 }}>✉️ hello@harvestcorner.example</p>
          <p style={{ fontSize: 14 }}>📍 128 Elm Street, in-store pickup available</p>
          <hr className="receipt-divider" />
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
            For order status, try <a href="/track-order" style={{ fontWeight: 700 }}>Track Order</a> first — it's the
            fastest way to see where things stand.
          </p>
        </div>
      </div>
    </div>
  );
}
