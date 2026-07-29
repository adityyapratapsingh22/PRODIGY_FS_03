import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const handle = setTimeout(() => {
      api
        .getProducts({ category, search, sort })
        .then((res) => setProducts(res.products))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 200); // small debounce for the search field
    return () => clearTimeout(handle);
  }, [category, search, sort]);

  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 4), [products]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <div className="hero-eyebrow">128 Elm Street · Same-day local delivery</div>
            <h1>The neighborhood grocery, now a click away.</h1>
            <p className="lede">
              Fresh produce, our own bakery, and pantry staples sourced from growers and
              makers within 20 miles — packed to order and on your porch by evening.
            </p>
            <div className="hero-actions">
              <a href="#shop" className="btn btn-primary">
                Start shopping
              </a>
              <a href="/track-order" className="btn btn-outline" style={{ borderColor: "var(--sage)", color: "var(--parchment)" }}>
                Track an order
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="num">20mi</div>
                <div className="label">sourcing radius</div>
              </div>
              <div className="hero-stat">
                <div className="num">6am</div>
                <div className="label">bakery starts fresh</div>
              </div>
              <div className="hero-stat">
                <div className="num">$35</div>
                <div className="label">free delivery over</div>
              </div>
            </div>
          </div>
          <div className="hero-stamp" aria-hidden="true">
            <div className="hero-stamp-inner">
              <span className="big">EST.</span>
              <span className="small">Locally Owned Since 2014</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container page" id="shop">
        <div className="section-heading">
          <div>
            <div className="eyebrow">On the shelves</div>
            <h2>Shop the store</h2>
          </div>
        </div>

        <FilterBar
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
        />

        {sort === "featured" && category === "All" && !search && featured.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <span className="badge badge-mustard">🏷 Staff picks mixed in below</span>
          </div>
        )}

        {error && <div className="alert alert-error">Couldn't reach the store server: {error}</div>}

        {loading ? (
          <div className="empty-state">
            <div className="stamp">⏳</div>
            Loading the shelves…
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="stamp">🔍</div>
            <h3>Nothing matches that search</h3>
            <p>Try a different category or clear your filters.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
