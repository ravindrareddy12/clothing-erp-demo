import mongoose from "mongoose";
import { withIdJSON } from "./plugin.js";

const inventoryItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  styleId: { type: Number, required: true },
  sku: { type: String, required: true },
  size: { type: String, default: "" },
  color: { type: String, default: "" },
  stockQty: { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 0 },
  costPrice: { type: Number, default: 0 }
});

withIdJSON(inventoryItemSchema);

export default mongoose.model("InventoryItem", inventoryItemSchema);
