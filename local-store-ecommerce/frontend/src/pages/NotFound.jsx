import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <div className="stamp">🗺️</div>
        <h2>Page not found</h2>
        <p>That aisle doesn't exist.</p>
        <Link to="/" className="btn btn-dark">
          Back to the shop
        </Link>
      </div>
    </div>
  );
}
