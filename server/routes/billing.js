import express from "express";
import Bill from "../models/Bill.js";
import InventoryItem from "../models/InventoryItem.js";
import Style from "../models/Style.js";
import Customer from "../models/Customer.js";
import StockTransaction from "../models/StockTransaction.js";
import { nextId } from "../models/Counter.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json((await Bill.find().sort({ id: 1 })).reverse());
});

// POST create a new bill
// body: { customerId (optional), items: [{ inventoryId, qty }] }
router.post("/", async (req, res) => {
  const { customerId, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array is required" });
  }

  // Validate stock availability first, so a bill either fully succeeds or fully fails.
  const invItems = [];
  for (const line of items) {
    const invItem = await InventoryItem.findOne({ id: Number(line.inventoryId) });
    if (!invItem) return res.status(404).json({ error: `Inventory item ${line.inventoryId} not found` });
    const qty = Number(line.qty) || 1;
    if (invItem.stockQty < qty) {
      const style = await Style.findOne({ id: invItem.styleId });
      return res.status(400).json({
        error: `Insufficient stock for ${style ? style.name : "item"} (${invItem.sku}). Available: ${invItem.stockQty}, requested: ${qty}`
      });
    }
    invItems.push(invItem);
  }

  let subtotal = 0;
  let taxTotal = 0;
  const lineItems = [];

  for (let idx = 0; idx < items.length; idx++) {
    const line = items[idx];
    const invItem = invItems[idx];
    const style = await Style.findOne({ id: invItem.styleId });
    const qty = Number(line.qty) || 1;

    const lineSubtotal = style.price * qty;
    const lineTax = (lineSubtotal * style.taxPercent) / 100;
    subtotal += lineSubtotal;
    taxTotal += lineTax;

    lineItems.push({
      inventoryId: invItem.id,
      sku: invItem.sku,
      name: style.name,
      size: invItem.size,
      color: invItem.color,
      price: style.price,
      qty,
      taxPercent: style.taxPercent,
      lineTotal: Number((lineSubtotal + lineTax).toFixed(2))
    });

    invItem.stockQty -= qty;
    await invItem.save();

    await StockTransaction.create({
      id: await nextId("stockTransactions"),
      inventoryId: invItem.id,
      type: "OUT",
      qty,
      date: new Date().toISOString().slice(0, 10),
      note: `Sold: ${style.name} (${invItem.sku})`
    });
  }

  const grandTotal = Number((subtotal + taxTotal).toFixed(2));

  let customer = null;
  if (customerId) {
    customer = await Customer.findOne({ id: Number(customerId) });
    if (customer) {
      customer.visits += 1;
      customer.loyaltyPoints += Math.floor(grandTotal / 100);
      await customer.save();
    }
  }

  const bill = await Bill.create({
    id: await nextId("bills"),
    date: new Date().toISOString(),
    customerId: customer ? customer.id : null,
    customerName: customer ? customer.name : "Walk-in Customer",
    items: lineItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(taxTotal.toFixed(2)),
    grandTotal
  });

  res.status(201).json(bill);
});

export default router;
