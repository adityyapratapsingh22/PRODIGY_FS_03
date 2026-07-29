const express = require("express");
const products = require("../data/products");
const { readDb } = require("../utils/db");

const router = express.Router();

function averageRating(productId) {
  const { reviews } = readDb();
  const productReviews = reviews.filter((r) => r.productId === productId);
  if (productReviews.length === 0) return { average: null, count: 0 };
  const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: Math.round((total / productReviews.length) * 10) / 10, count: productReviews.length };
}

function withRating(product) {
  const { average, count } = averageRating(product.id);
  return { ...product, ratingAverage: average, ratingCount: count };
}

// GET /api/products?search=&category=&sort=&minPrice=&maxPrice=&tag=
router.get("/", (req, res) => {
  const { search, category, sort, minPrice, maxPrice, tag } = req.query;
  let results = products.map(withRating);

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    results = results.filter((p) => p.category === category);
  }

  if (tag) {
    results = results.filter((p) => p.tags.includes(tag));
  }

  if (minPrice) {
    results = results.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter((p) => p.price <= Number(maxPrice));
  }

  switch (sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating-desc":
      results.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
      break;
    default:
      break; // "featured" / default order
  }

  res.json({ count: results.length, products: results });
});

// GET /api/products/categories
router.get("/categories", (req, res) => {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  res.json({ categories });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ product: withRating(product) });
});

module.exports = router;
