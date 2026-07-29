import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  function handleAdd(e) {
    e.preventDefault();
    addItem(product, 1);
    showToast(`Added ${product.name} to your cart`);
  }

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tags?.length > 0 && (
          <div className="product-card-tags">
            {product.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-stamp">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="product-card-body">
        <span className="product-card-cat">{product.category}</span>
        <span className="product-card-name">{product.name}</span>
        <span className="product-card-unit">{product.unit}</span>
        {product.ratingCount > 0 && (
          <div className="rating-line">
            <StarRating value={product.ratingAverage} size={13} />
            <span>({product.ratingCount})</span>
          </div>
        )}
        <div className="product-card-footer">
          <span className="price-tag">
            ${product.price.toFixed(2)} <span className="unit">{product.unit}</span>
          </span>
          <button className="btn btn-dark btn-sm" onClick={handleAdd} disabled={product.stock === 0}>
            {product.stock === 0 ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}
