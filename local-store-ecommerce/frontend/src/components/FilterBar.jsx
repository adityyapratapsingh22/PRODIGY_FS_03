export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="filter-bar">
      <div className="chip-row">
        <button className={`chip ${activeCategory === "All" ? "active" : ""}`} onClick={() => onCategoryChange("All")}>
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        className="search-input"
        type="search"
        placeholder="Search the shelves…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search products"
      />

      <select value={sort} onChange={(e) => onSortChange(e.target.value)} aria-label="Sort products">
        <option value="featured">Sort: Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A–Z</option>
        <option value="rating-desc">Top Rated</option>
      </select>
    </div>
  );
}
