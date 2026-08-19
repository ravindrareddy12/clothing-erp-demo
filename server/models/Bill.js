import mongoose from "mongoose";
import { withIdJSON } from "./plugin.js";

const billLineItemSchema = new mongoose.Schema(
  {
    inventoryId: Number,
    sku: String,
    name: String,
    size: String,
    color: String,
    price: Number,
    qty: Number,
    taxPercent: Number,
    lineTotal: Number
  },
  { _id: false }
);

const billSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  date: { type: String, required: true },
  customerId: { type: Number, default: null },
  customerName: { type: String, default: "Walk-in Customer" },
  items: [billLineItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  grandTotal: { type: Number, required: true }
});

withIdJSON(billSchema);

export default mongoose.model("Bill", billSchema);
