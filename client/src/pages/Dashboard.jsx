import { useEffect, useState } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bills, setBills] = useState([]);
  const [styles, setStyles] = useState([]);

  useEffect(() => {
    api.inventory.list().then(setInventory);
    api.customers.list().then(setCustomers);
    api.billing.list().then(setBills);
    api.pricing.list().then(setStyles);
  }, []);

  const lowStockCount = inventory.filter((i) => i.stockQty <= i.reorderLevel).length;
  const totalSales = bills.reduce((sum, b) => sum + b.grandTotal, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Overview of your store's sales and stock</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="value">₹{totalSales.toFixed(0)}</div>
          <div className="label">Total Sales (session)</div>
        </div>
        <div className="stat-card">
          <div className="value">{bills.length}</div>
          <div className="label">Bills Generated</div>
        </div>
        <div className="stat-card">
          <div className="value">{styles.length}</div>
          <div className="label">Styles in Catalog</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ color: lowStockCount ? "#dc2626" : "#0f2440" }}>
            {lowStockCount}
          </div>
          <div className="label">Low Stock SKUs</div>
        </div>
        <div className="stat-card">
          <div className="value">{customers.length}</div>
          <div className="label">Registered Customers</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Recent Bills</h3>
        <table>
          <thead>
            <tr>
              <th>Bill #</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {bills.slice(0, 5).map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.customerName}</td>
                <td>{b.items.length}</td>
                <td>₹{b.grandTotal.toFixed(2)}</td>
              </tr>
            ))}
            {bills.length === 0 && (
              <tr><td colSpan={4} style={{ color: "#64748b" }}>No bills yet — try the Billing tab.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
