require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productsRoutes = require("./routes/products.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const ordersRoutes = require("./routes/orders.routes");
const supportRoutes = require("./routes/support.routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", store: "Harvest Corner" }));

app.use("/api/products", reviewsRoutes); // /api/products/:id/reviews
app.use("/api/products", productsRoutes); // /api/products, /api/products/:id, /api/products/categories
app.use("/api/orders", ordersRoutes);
app.use("/api/support", supportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Harvest Corner API running at http://localhost:${PORT}`);
});
