# Harvest Corner — Local Store E-commerce Platform

A full-stack e-commerce site for a neighborhood grocery store, built with **React (Vite)** on
the frontend and **Node.js / Express** on the backend.

Customers can browse products by category, search and sort them, add items to a cart,
check out, track their order's delivery status, leave product reviews, and contact
customer support.

## Features

**Core**
- Product listings with images, descriptions, prices, and stock
- Shopping cart (persisted in the browser, editable quantities)
- Checkout that creates a real order on the backend

**Optional features (all implemented)**
- 📦 **Order tracking** — look up any order by ID and see a live status timeline
  (Placed → Packed → Out for Delivery → Delivered)
- ⭐ **User reviews** — star ratings + comments per product, shown on the product page
- 💬 **Customer support** — a contact form that opens a support ticket
- 🔍 **Sort & filters** — filter by category, search by name/description, and sort by
  price, name, or rating

## Project structure

```
local-store-ecommerce/
├── backend/               Node.js + Express API
│   ├── src/
│   │   ├── index.js          App entry point
│   │   ├── data/products.js  Product catalog (seed data)
│   │   ├── data/db.json      Auto-created — stores orders, reviews, support tickets
│   │   ├── routes/           products, reviews, orders, support
│   │   ├── middleware/       error handling
│   │   └── utils/db.js       tiny JSON file "database"
│   └── package.json
│
└── frontend/              React (Vite) frontend
    ├── src/
    │   ├── main.jsx / App.jsx
    │   ├── api.js             fetch wrapper for the backend
    │   ├── context/           CartContext (localStorage), ToastContext
    │   ├── components/        Navbar, ProductCard, FilterBar, StarRating, Footer
    │   └── pages/              Home, ProductDetail, Cart, Checkout,
    │                           OrderConfirmation, TrackOrder, Support
    └── package.json
```

No external database is required — the backend persists orders, reviews, and support
tickets to a local JSON file (`backend/src/data/db.json`), which is created automatically
the first time you run it.

## Getting started

You'll need **Node.js 18+** installed.

### 1. Start the backend

```bash
cd backend
npm install
cp .env.example .env      # optional — defaults already work
npm start
```

The API runs at `http://localhost:4000`. You can sanity-check it with:
`curl http://localhost:4000/api/health`

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env      # optional — defaults already work
npm run dev
```

The site runs at `http://localhost:5173`.

Open that URL in your browser — the storefront, cart, checkout, order tracking,
reviews, and support form are all live and talking to the local API.

### 3. Build for production (optional)

```bash
cd frontend
npm run build       # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host, and deploy `backend/` to any Node host
(Render, Railway, Fly.io, a VPS, etc). Set `CLIENT_ORIGIN` in the backend's `.env` to
your deployed frontend URL, and `VITE_API_URL` in the frontend's `.env` to your deployed
API URL before building.

## API reference

| Method | Endpoint                        | Description                          |
|--------|----------------------------------|---------------------------------------|
| GET    | `/api/products`                 | List products — supports `?search=&category=&sort=&minPrice=&maxPrice=&tag=` |
| GET    | `/api/products/categories`      | List all categories                  |
| GET    | `/api/products/:id`             | Get a single product                 |
| GET    | `/api/products/:id/reviews`     | Get reviews for a product            |
| POST   | `/api/products/:id/reviews`     | Add a review `{ name, rating, comment }` |
| POST   | `/api/orders`                   | Place an order `{ items, customer }` |
| GET    | `/api/orders/:id`               | Look up an order and its tracking status |
| POST   | `/api/support`                  | Submit a support ticket `{ name, email, topic, message }` |

`sort` accepts: `featured` (default), `price-asc`, `price-desc`, `name-asc`, `rating-desc`.

## Customizing for your own local store

- Edit `backend/src/data/products.js` to swap in your real products, prices, and photos
  (any image URL works — swap the `picsum.photos` placeholders for your own photos).
- Update the store name, address, and hours in `frontend/src/components/Navbar.jsx`,
  `Footer.jsx`, `Home.jsx`, and `Support.jsx`.
- Colors, fonts, and the "ticket" price-tag styling live in `frontend/src/index.css`
  under `:root` — change the CSS variables to reskin the whole site.
- Delivery fee, free-delivery threshold, and tax rate are set in
  `backend/src/routes/orders.routes.js` and mirrored in `frontend/src/context/CartContext.jsx`.
