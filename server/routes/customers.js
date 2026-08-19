import express from "express";
import Customer from "../models/Customer.js";
import { nextId } from "../models/Counter.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json(await Customer.find().sort({ id: 1 }));
});

router.post("/", async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone) return res.status(400).json({ error: "name and phone are required" });
  const customer = await Customer.create({
    id: await nextId("customers"),
    name,
    phone,
    email: email || "",
    visits: 0,
    loyaltyPoints: 0
  });
  res.status(201).json(customer);
});

router.put("/:id", async (req, res) => {
  const customer = await Customer.findOneAndUpdate({ id: Number(req.params.id) }, req.body, { new: true });
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findOneAndDelete({ id: Number(req.params.id) });
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.status(204).end();
});

export default router;
