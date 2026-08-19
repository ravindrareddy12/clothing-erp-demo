import Style from "./models/Style.js";
import InventoryItem from "./models/InventoryItem.js";
import StockTransaction from "./models/StockTransaction.js";
import Customer from "./models/Customer.js";
import Counter from "./models/Counter.js";

const sampleStyles = [
  { id: 1, styleCode: "SH-101", name: "Men's Cotton Shirt", brand: "Urban Fit", category: "Shirts", price: 899, taxPercent: 5 },
  { id: 2, styleCode: "JN-205", name: "Slim Fit Denim Jeans", brand: "Denim Co", category: "Jeans", price: 1499, taxPercent: 12 },
  { id: 3, styleCode: "KR-310", name: "Women's Printed Kurti", brand: "Ethnic Weave", category: "Kurtis", price: 649, taxPercent: 5 },
  { id: 4, styleCode: "TS-402", name: "Round Neck T-Shirt", brand: "Urban Fit", category: "T-Shirts", price: 499, taxPercent: 5 }
];

const sampleInventory = [
  { id: 1, styleId: 1, sku: "SH-101-M-BLU", size: "M", color: "Blue", stockQty: 24, reorderLevel: 8, costPrice: 520 },
  { id: 2, styleId: 1, sku: "SH-101-L-BLU", size: "L", color: "Blue", stockQty: 15, reorderLevel: 8, costPrice: 520 },
  { id: 3, styleId: 1, sku: "SH-101-M-WHT", size: "M", color: "White", stockQty: 6, reorderLevel: 8, costPrice: 520 },
  { id: 4, styleId: 2, sku: "JN-205-32-BLK", size: "32", color: "Black", stockQty: 18, reorderLevel: 5, costPrice: 850 },
  { id: 5, styleId: 2, sku: "JN-205-34-BLK", size: "34", color: "Black", stockQty: 10, reorderLevel: 5, costPrice: 850 },
  { id: 6, styleId: 3, sku: "KR-310-S-PNK", size: "S", color: "Pink", stockQty: 20, reorderLevel: 6, costPrice: 340 },
  { id: 7, styleId: 4, sku: "TS-402-M-BLK", size: "M", color: "Black", stockQty: 30, reorderLevel: 10, costPrice: 260 }
];

const sampleStockTransactions = [
  { id: 1, inventoryId: 1, type: "IN", qty: 30, date: "2026-08-10", note: "Initial stock from supplier" },
  { id: 2, inventoryId: 1, type: "OUT", qty: 6, date: "2026-08-12", note: "Sold in-store" }
];

const sampleCustomers = [
  { id: 1, name: "Anita Rao", phone: "9876543210", email: "anita@example.com", visits: 4, loyaltyPoints: 210 },
  { id: 2, name: "Vikram Singh", phone: "9123456780", email: "vikram@example.com", visits: 2, loyaltyPoints: 90 }
];

const nextIdSeeds = { styles: 5, inventory: 8, stockTransactions: 3, customers: 3, bills: 1 };

// Seeds sample data on first run only — an already-populated database (or one
// the user has started editing) is left untouched.
export async function seedIfEmpty() {
  if (await Style.countDocuments()) {
    return;
  }

  await Style.insertMany(sampleStyles);
  await InventoryItem.insertMany(sampleInventory);
  await StockTransaction.insertMany(sampleStockTransactions);
  await Customer.insertMany(sampleCustomers);

  await Counter.bulkWrite(
    Object.entries(nextIdSeeds).map(([name, seq]) => ({
      updateOne: {
        filter: { _id: name },
        update: { $setOnInsert: { seq: seq - 1 } },
        upsert: true
      }
    }))
  );

  console.log("Seeded sample data into MongoDB");
}
