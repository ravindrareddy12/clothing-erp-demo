import express from "express";
import InventoryItem from "../models/InventoryItem.js";
import Style from "../models/Style.js";
import { nextId } from "../models/Counter.js";

const router = express.Router();

// GET all inventory items, enriched with style info
router.get("/", async (req, res) => {
  const [items, styles] = await Promise.all([
    InventoryItem.find().sort({ id: 1 }).lean(),
    Style.find().lean()
  ]);
  const styleById = new Map(styles.map((s) => [s.id, s]));

  const enriched = items.map(({ _id, __v, ...i }) => {
    const style = styleById.get(i.styleId);
    return {
      ...i,
      styleName: style ? style.name : "Unknown",
      styleCode: style ? style.styleCode : "",
      brand: style ? style.brand : "",
      category: style ? style.category : "",
      price: style ? style.price : 0
    };
  });
  res.json(enriched);
});

// POST new SKU/variant under an existing style
router.post("/", async (req, res) => {
  const { styleId, sku, size, color, stockQty, reorderLevel, costPrice } = req.body;
  const style = await Style.findOne({ id: Number(styleId) });
  if (!style) return res.status(400).json({ error: "Valid styleId is required" });
  if (!sku) return res.status(400).json({ error: "sku is required" });

  const item = await InventoryItem.create({
    id: await nextId("inventory"),
    styleId: style.id,
    sku,
    size: size || "",
    color: color || "",
    stockQty: Number(stockQty) || 0,
    reorderLevel: Number(reorderLevel) || 0,
    costPrice: Number(costPrice) || 0
  });
  res.status(201).json(item);
});

router.put("/:id", async (req, res) => {
  const item = await InventoryItem.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

router.delete("/:id", async (req, res) => {
  const item = await InventoryItem.findOneAndDelete({ id: Number(req.params.id) });
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.status(204).end();
});

export default router;
