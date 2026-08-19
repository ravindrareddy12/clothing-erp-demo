import mongoose from "mongoose";
import { withIdJSON } from "./plugin.js";

const styleSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  styleCode: { type: String, required: true },
  name: { type: String, required: true },
  brand: { type: String, default: "" },
  category: { type: String, default: "General" },
  price: { type: Number, required: true },
  taxPercent: { type: Number, default: 0 }
});

withIdJSON(styleSchema);

export default mongoose.model("Style", styleSchema);
