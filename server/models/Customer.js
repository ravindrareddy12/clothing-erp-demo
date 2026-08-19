import mongoose from "mongoose";
import { withIdJSON } from "./plugin.js";

const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: "" },
  visits: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 }
});

withIdJSON(customerSchema);

export default mongoose.model("Customer", customerSchema);
