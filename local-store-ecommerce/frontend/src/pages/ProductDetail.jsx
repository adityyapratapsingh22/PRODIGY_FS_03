import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import StarRating from "../components/StarRating";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { addItem } = useCart();
  const { showToast } = useToast();

  function loadReviews() {
    api.getReviews(id).then((res) => setReviews(res.reviews));
  }

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setQty(1);
    api
      .getProduct(id)
      .then((res) => setProduct(res.product))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    loadReviews();
    window.scrollTo({ top: 0 });
  }, [id]);

  function handleAddToCart() {
    addItem(product, qty);
    showToast(`Added ${qty} × ${product.name} to your cart`);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewError(null);
    setSubmitting(true);
    try {
      await api.addReview(id, reviewForm);
      setReviewForm({ name: "", rating: 5, comment: "" });
      loadReviews();
      const fresh = await api.getProduct(id);
      setProduct(fresh.product);
      showToast("Thanks for the review!");
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div className="stamp">⏳</div>
          Loading product…
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="container page">
        <div className="empty-state">
          <div className="stamp">🤷</div>
          <h3>We couldn't find that product</h3>
          <Link to="/" className="btn btn-dark" style={{ marginTop: 12 }}>
            Back to the shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ fontSize: 13.5, color: "var(--ink-soft)", fontWeight: 600 }}>
          ← Back to shop
        </Link>
      </div>

      <div className="product-detail">
        <div className="product-detail-media">
          <img src={product.image} alt={product.name} />
        </div>

        <div>
          <span className="product-card-cat">{product.category}</span>
          <h1 style={{ marginTop: 6 }}>{product.name}</h1>

          {product.ratingCount > 0 ? (
            <div className="rating-line" style={{ marginBottom: 14 }}>
              <StarRating value={product.ratingAverage} />
              <span>
                {product.ratingAverage} · {product.ratingCount} review{product.ratingCount === 1 ? "" : "s"}
              </span>
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 14 }}>No reviews yet — be the first</p>
          )}

          <p style={{ fontSize: 15.5, color: "var(--ink-soft)" }}>{product.description}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {product.tags?.map((tag) => (
              <span key={tag} className="badge badge-sage">
                {tag}
              </span>
            ))}
            <span className={`badge ${product.stock > 5 ? "badge-mustard" : "badge-brick"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
            </span>
          </div>

          <div className="price-tag large" style={{ marginBottom: 22 }}>
            ${product.price.toFixed(2)} <span className="unit">{product.unit}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div className="qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">
                +
              </button>
            </div>
            <button className="btn btn-primary" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? "Sold out" : `Add to cart · $${(product.price * qty).toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 56, maxWidth: 720 }}>
        <h3>Customer reviews</h3>

        {reviews.length === 0 ? (
          <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>No reviews yet for this product.</p>
        ) : (
          <div style={{ marginBottom: 24 }}>
            {reviews.map((r) => (
              <div key={r.id} className="review">
                <div className="review-head">
                  <span className="review-name">{r.name}</span>
                  <StarRating value={r.rating} size={13} />
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14.5 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        <h4 style={{ marginTop: 8 }}>Leave a review</h4>
        {reviewError && <div className="alert alert-error">{reviewError}</div>}
        <form onSubmit={handleReviewSubmit} className="form-grid">
          <div className="field">
            <label htmlFor="rname">Name</label>
            <input
              id="rname"
              required
              value={reviewForm.name}
              onChange={(e) => setReviewForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="field">
            <label htmlFor="rrating">Rating</label>
            <select
              id="rrating"
              value={reviewForm.rating}
              onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
          <div className="field full">
            <label htmlFor="rcomment">Comment</label>
            <textarea
              id="rcomment"
              required
              rows={3}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
            />
          </div>
          <div className="full">
            <button className="btn btn-dark" type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Post review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
