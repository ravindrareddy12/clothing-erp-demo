import express from "express";
import Style from "../models/Style.js";
import { nextId } from "../models/Counter.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Style.find().sort({ id: 1 }));
});

router.post("/", async (req, res) => {
  const { styleCode, name, brand, category, price, taxPercent } = req.body;
  if (!styleCode || !name || price == null) {
    return res.status(400).json({ error: "styleCode, name and price are required" });
  }
  const style = await Style.create({
    id: await nextId("styles"),
    styleCode,
    name,
    brand: brand || "",
    category: category || "General",
    price: Number(price),
    taxPercent: Number(taxPercent) || 0
  });
  res.status(201).json(style);
});

router.put("/:id", async (req, res) => {
  const style = await Style.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
  if (!style) return res.status(404).json({ error: "Style not found" });
  res.json(style);
});

router.delete("/:id", async (req, res) => {
  const style = await Style.findOneAndDelete({ id: Number(req.params.id) });
  if (!style) return res.status(404).json({ error: "Style not found" });
  res.status(204).end();
});

export default router;
