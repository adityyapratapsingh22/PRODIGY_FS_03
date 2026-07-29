import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          <span className="brand-stamp" aria-hidden="true">
            🌾
          </span>
          Harvest Corner
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Shop
          </NavLink>
          <NavLink to="/track-order" className={({ isActive }) => (isActive ? "active" : "")}>
            Track Order
          </NavLink>
          <NavLink to="/support" className={({ isActive }) => (isActive ? "active" : "")}>
            Support
          </NavLink>
        </nav>

        <NavLink to="/cart" className="nav-cart" aria-label={`Cart, ${count} items`}>
          🧺 Cart
          <span className="nav-cart-count">{count}</span>
        </NavLink>
      </div>
    </header>
  );
}
