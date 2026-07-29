const express = require("express");
const crypto = require("crypto");
const products = require("../data/products");
const { readDb, writeDb } = require("../utils/db");

const router = express.Router();

// GET /api/products/:id/reviews
router.get("/:id/reviews", (req, res) => {
  const { reviews } = readDb();
  const productReviews = reviews
    .filter((r) => r.productId === req.params.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ reviews: productReviews });
});

// POST /api/products/:id/reviews  { name, rating, comment }
router.post("/:id/reviews", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const { name, rating, comment } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  const ratingNum = Number(rating);
  if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  if (!comment || !String(comment).trim()) {
    return res.status(400).json({ error: "Comment is required" });
  }

  const db = readDb();
  const newReview = {
    id: crypto.randomUUID(),
    productId: req.params.id,
    name: String(name).trim(),
    rating: ratingNum,
    comment: String(comment).trim(),
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(newReview);
  writeDb(db);

  res.status(201).json({ review: newReview });
});

module.exports = router;
