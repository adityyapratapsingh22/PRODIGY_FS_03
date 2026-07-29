const express = require("express");
const crypto = require("crypto");
const { readDb, writeDb } = require("../utils/db");

const router = express.Router();

// POST /api/support  { name, email, topic, message }
router.post("/", (req, res) => {
  const { name, email, topic, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const db = readDb();
  const ticket = {
    id: `TK-${crypto.randomInt(1000, 9999)}`,
    name,
    email,
    topic: topic || "General question",
    message,
    createdAt: new Date().toISOString(),
    status: "Open",
  };
  db.supportTickets.push(ticket);
  writeDb(db);

  res.status(201).json({ ticket });
});

module.exports = router;
