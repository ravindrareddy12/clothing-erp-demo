import express from "express";
import StockTransaction from "../models/StockTransaction.js";
import InventoryItem from "../models/InventoryItem.js";
import Style from "../models/Style.js";
import { nextId } from "../models/Counter.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [txns, items, styles] = await Promise.all([
    StockTransaction.find().sort({ id: 1 }).lean(),
    InventoryItem.find().lean(),
    Style.find().lean()
  ]);
  const itemById = new Map(items.map((i) => [i.id, i]));
  const styleById = new Map(styles.map((s) => [s.id, s]));

  const enriched = txns.map(({ _id, __v, ...t }) => {
    const item = itemById.get(t.inventoryId);
    const style = item ? styleById.get(item.styleId) : null;
    return {
      ...t,
      sku: item ? item.sku : "Unknown",
      styleName: style ? style.name : "Unknown",
      size: item ? item.size : "",
      color: item ? item.color : ""
    };
  });
  res.json(enriched.reverse());
});

router.post("/", async (req, res) => {
  const { inventoryId, type, qty, note, date } = req.body;
  const item = await InventoryItem.findOne({ id: Number(inventoryId) });
  if (!item) return res.status(404).json({ error: "Inventory item not found" });
  if (!["IN", "OUT"].includes(type)) return res.status(400).json({ error: "type must be IN or OUT" });

  const quantity = Number(qty);
  if (!quantity || quantity <= 0) return res.status(400).json({ error: "qty must be a positive number" });

  if (type === "OUT" && item.stockQty < quantity) {
    return res.status(400).json({ error: `Insufficient stock. Available: ${item.stockQty}` });
  }

  item.stockQty += type === "IN" ? quantity : -quantity;
  await item.save();

  const txn = await StockTransaction.create({
    id: await nextId("stockTransactions"),
    inventoryId: item.id,
    type,
    qty: quantity,
    date: date || new Date().toISOString().slice(0, 10),
    note: note || ""
  });
  res.status(201).json({ transaction: txn, updatedItem: item });
});

export default router;
