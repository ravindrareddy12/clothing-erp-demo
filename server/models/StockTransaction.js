import mongoose from "mongoose";
import { withIdJSON } from "./plugin.js";

const stockTransactionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  inventoryId: { type: Number, required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  qty: { type: Number, required: true },
  date: { type: String, required: true },
  note: { type: String, default: "" }
});

withIdJSON(stockTransactionSchema);

export default mongoose.model("StockTransaction", stockTransactionSchema);
