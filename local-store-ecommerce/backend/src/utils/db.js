// Tiny file-backed "database". No external DB needed to run this project.
// Reads/writes a single JSON file that stores orders, reviews, and support tickets.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const DEFAULT_DATA = {
  reviews: [
    {
      id: "r001",
      productId: "p05",
      name: "Dana K.",
      rating: 5,
      comment: "Best sourdough I've had outside of San Francisco. The crust is unreal.",
      createdAt: "2026-06-02T14:12:00.000Z",
    },
    {
      id: "r002",
      productId: "p05",
      name: "Marcus T.",
      rating: 4,
      comment: "Sells out fast — get there before 10am on Saturdays.",
      createdAt: "2026-06-10T09:40:00.000Z",
    },
    {
      id: "r003",
      productId: "p08",
      name: "Priya S.",
      rating: 5,
      comment: "You can really taste the difference from grocery-store eggs. Yolks are so orange.",
      createdAt: "2026-05-28T18:02:00.000Z",
    },
    {
      id: "r004",
      productId: "p13",
      name: "Owen R.",
      rating: 5,
      comment: "Peppery finish, exactly as described. Now my only olive oil.",
      createdAt: "2026-06-15T11:20:00.000Z",
    },
  ],
  orders: [],
  supportTickets: [],
};

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_DATA;
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };
