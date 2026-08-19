# Clothing Retail ERP — Demo (Inventory, Stock, Customer, Billing, Pricing)

A basic full-stack demo built with **React (Vite) + Node.js/Express**, covering the 5 modules requested for the client demo — built for **apparel/clothing retail** (styles, sizes, colors, SKUs).

- **Pricing / Styles** — style master with brand, category, price and GST% (e.g. Men's Cotton Shirt, style code SH-101)
- **Inventory** — SKU-level stock per size/color variant of each style, with reorder alerts
- **Stock In/Out** — record new arrivals, returns, or corrections per SKU; updates inventory in real time
- **Customers** — customer database with visit count and auto-accruing loyalty points
- **Billing / POS** — pick SKUs (size/color) into a cart, checkout generates a GST-calculated bill and **auto-deducts stock** for the exact SKU sold

> Data is persisted in MongoDB (see `server/.env`) — it survives server restarts. The database is seeded with sample data automatically the first time it's empty; after that, seeding is skipped so your own changes aren't overwritten.

## Project structure

```
clothing-erp-demo/
├── server/          Node.js + Express API (port 4000)
│   ├── routes/       pricing.js, inventory.js, stock.js, customers.js, billing.js
│   ├── models/        Mongoose schemas: Style, InventoryItem, StockTransaction, Customer, Bill, Counter
│   ├── db.js           MongoDB connection
│   ├── seed.js          seeds sample data on first run (only if the DB is empty)
│   ├── .env             MONGODB_URI + PORT (not committed — see .env.example)
│   └── server.js
└── client/          React (Vite) frontend (port 5173)
    └── src/
        ├── pages/     Dashboard, Pricing, Inventory, Stock, Customers, Billing
        └── components/Sidebar.jsx
```

## How to run

**1. Configure the backend**

Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your MongoDB connection string (a MongoDB Atlas free-tier cluster works fine). `server/.env` is gitignored — never commit it.

**2. Start the backend**
```bash
cd server
npm install
npm start
```
Runs on `http://localhost:4000`. Health check: `http://localhost:4000/api/health`

> Note: port 5000 is avoided here because macOS's built-in AirPlay Receiver listens on it by default, which blocks Node from binding to it.

**3. Start the frontend** (in a new terminal)
```bash
cd client
npm install
npm run dev
```
Runs on `http://localhost:5173` — open this in your browser. The Vite dev server proxies `/api` calls to the backend automatically.

## Demo flow to show the client

1. **Dashboard** — overview stats (starts empty until you bill an order)
2. **Pricing / Styles** — show the style catalog: shirts, jeans, kurtis, t-shirts with brand, GST%
3. **Inventory** — show SKU-level stock split by size and color for each style, with low-stock flags
4. **Billing** — add a customer, pick specific SKUs (e.g. Shirt, size M, Blue) into the cart, click "Generate Bill" — GST auto-calculates per style, and watch Inventory stock reduce for that exact SKU
5. **Stock In/Out** — log a fresh stock arrival and see inventory update immediately
6. **Customers** — show loyalty points/visits incrementing after billing

## Sample data preloaded

- 4 styles: Men's Cotton Shirt (Urban Fit), Slim Fit Denim Jeans (Denim Co), Women's Printed Kurti (Ethnic Weave), Round Neck T-Shirt (Urban Fit)
- 7 SKUs across those styles in different sizes/colors
- 2 sample customers

## Notes for scaling this into the full product

This demo validates the workflow across modules. For the real multi-outlet, offline-first (desktop + tablet) build discussed earlier, the next steps would be:
- Add outlet-level data isolation and head-office rollup reporting
- Add barcode scanning support for SKU lookup at billing
- Package into Flutter (or Electron + native Android) for Windows desktop + Android tablet
- Add 1-year license validation and activation flow
