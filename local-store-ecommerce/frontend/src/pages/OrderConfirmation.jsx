import { Link, useParams } from "react-router-dom";

export default function OrderConfirmation() {
  const { id } = useParams();

  return (
    <div className="container page">
      <div className="empty-state" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="stamp">✅</div>
        <h2>Order placed!</h2>
        <p>
          Thanks for shopping local. Your order ID is{" "}
          <span className="price-tag" style={{ fontSize: 15 }}>
            {id}
          </span>
        </p>
        <p style={{ fontSize: 13.5 }}>We've sent a confirmation to your email. Save your order ID to track it.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          <Link to={`/track-order?id=${id}`} className="btn btn-primary">
            Track this order
          </Link>
          <Link to="/" className="btn btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
