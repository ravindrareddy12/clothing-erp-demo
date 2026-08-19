import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./db.js";
import { seedIfEmpty } from "./seed.js";
import inventoryRoutes from "./routes/inventory.js";
import stockRoutes from "./routes/stock.js";
import customerRoutes from "./routes/customers.js";
import pricingRoutes from "./routes/pricing.js";
import billingRoutes from "./routes/billing.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", message: "Clothing Retail ERP API running" }));

app.use("/api/inventory", inventoryRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/billing", billingRoutes);

await connectDB();
await seedIfEmpty();

app.listen(PORT, () => {
  console.log(`Clothing ERP server running on http://localhost:${PORT}`);
});
