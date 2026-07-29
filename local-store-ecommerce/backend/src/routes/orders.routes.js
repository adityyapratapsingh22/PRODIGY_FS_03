const express = require("express");
const crypto = require("crypto");
const products = require("../data/products");
const { readDb, writeDb } = require("../utils/db");

const router = express.Router();

const TRACKING_STAGES = ["Placed", "Packed", "Out for Delivery", "Delivered"];

// Demo-friendly tracking: the order visibly progresses through stages over a
// few minutes so "Track Order" has something real to show without a live courier feed.
function computeTrackingStatus(createdAt) {
  const minutesElapsed = (Date.now() - new Date(createdAt).getTime()) / 60000;
  let stageIndex = 0;
  if (minutesElapsed >= 6) stageIndex = 3;
  else if (minutesElapsed >= 3) stageIndex = 2;
  else if (minutesElapsed >= 1) stageIndex = 1;
  else stageIndex = 0;

  return TRACKING_STAGES.map((stage, i) => ({
    stage,
    completed: i <= stageIndex,
    current: i === stageIndex,
  }));
}

function generateOrderId() {
  const random = crypto.randomInt(100000, 999999);
  return `HC-${random}`;
}

// POST /api/orders  { items: [{ productId, qty }], customer: { name, email, phone, address } }
router.post("/", (req, res) => {
  const { items, customer } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Order must include at least one item" });
  }
  if (!customer || !customer.name || !customer.email || !customer.address) {
    return res.status(400).json({ error: "Customer name, email, and address are required" });
  }

  const lineItems = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Unknown product: ${item.productId}` });
    }
    const qty = Number(item.qty) || 0;
    if (qty <= 0) {
      return res.status(400).json({ error: `Invalid quantity for ${product.name}` });
    }
    if (qty > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} of ${product.name} left in stock` });
    }
    lineItems.push({
      productId: product.id,
      name: product.name,
      unit: product.unit,
      price: product.price,
      qty,
      lineTotal: Math.round(product.price * qty * 100) / 100,
    });
  }

  const subtotal = Math.round(lineItems.reduce((sum, li) => sum + li.lineTotal, 0) * 100) / 100;
  const deliveryFee = subtotal >= 35 ? 0 : 4.99;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  const db = readDb();
  const order = {
    id: generateOrderId(),
    items: lineItems,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address,
      notes: customer.notes || "",
    },
    subtotal,
    deliveryFee,
    tax,
    total,
    createdAt: new Date().toISOString(),
  };

  db.orders.push(order);
  writeDb(db);

  res.status(201).json({ order: { ...order, tracking: computeTrackingStatus(order.createdAt) } });
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const { orders } = readDb();
  const order = orders.find((o) => o.id.toLowerCase() === req.params.id.toLowerCase());
  if (!order) return res.status(404).json({ error: "Order not found. Double-check your order ID." });

  res.json({ order: { ...order, tracking: computeTrackingStatus(order.createdAt) } });
});

module.exports = router;
