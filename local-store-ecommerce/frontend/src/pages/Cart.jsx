import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, deliveryFee, tax, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div className="stamp">🧺</div>
          <h3>Your cart is empty</h3>
          <p>Add a few things from the shelves to get started.</p>
          <Link to="/" className="btn btn-dark">
            Browse the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Your cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40, alignItems: "start" }}>
        <div className="panel">
          {items.map((item) => (
            <div className="cart-item" key={item.productId}>
              <img src={item.image} alt={item.name} />
              <div>
                <div style={{ fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 16 }}>{item.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                  {item.unit} · ${item.price.toFixed(2)} each
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(item.productId)}>
                  Remove
                </button>
              </div>
              <div className="qty-stepper">
                <button onClick={() => updateQty(item.productId, item.qty - 1)} aria-label={`Decrease ${item.name} quantity`}>
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.productId, item.qty + 1)} aria-label={`Increase ${item.name} quantity`}>
                  +
                </button>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="receipt">
          <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 14 }}>Order summary</h3>
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
          {deliveryFee > 0 && (
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 10 }}>
              Add ${(35 - subtotal).toFixed(2)} more for free delivery.
            </p>
          )}
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
