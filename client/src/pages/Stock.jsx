import { useEffect, useState } from "react";
import { api } from "../api";

export default function Stock() {
  const [items, setItems] = useState([]);
  const [txns, setTxns] = useState([]);
  const [form, setForm] = useState({ inventoryId: "", type: "IN", qty: "", note: "" });
  const [error, setError] = useState("");

  const load = () => {
    api.inventory.list().then(setItems);
    api.stock.list().then(setTxns);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.inventoryId) { setError("Select a SKU"); return; }
    try {
      await api.stock.create(form);
      setForm({ inventoryId: "", type: "IN", qty: "", note: "" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Stock In / Out</h2>
          <p>Record new arrivals, returns, or manual stock corrections per SKU</p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>New Transaction</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>SKU</label>
              <select value={form.inventoryId} onChange={(e) => setForm({ ...form, inventoryId: e.target.value })}>
                <option value="">Select SKU</option>
                {items.map((i) => (
                  <option key={i.id} value={i.id}>{i.sku} — {i.styleName} ({i.size}/{i.color}) — {i.stockQty} in stock</option>
                ))}
              </select>
            </div>
            <div>
              <label>Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="IN">Stock IN (New Arrival)</option>
                <option value="OUT">Stock OUT (Return/Damage)</option>
              </select>
            </div>
            <div>
              <label>Quantity</label>
              <input required type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
            </div>
            <div>
              <label>Note</label>
              <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Supplier / reason" />
            </div>
          </div>
          <button className="btn" type="submit">Save Transaction</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>SKU</th>
              <th>Style</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.sku}</td>
                <td>{t.styleName} ({t.size}/{t.color})</td>
                <td>
                  <span className={`badge ${t.type === "IN" ? "ok" : "low"}`}>{t.type}</span>
                </td>
                <td>{t.qty}</td>
                <td>{t.note}</td>
              </tr>
            ))}
            {txns.length === 0 && (
              <tr><td colSpan={6} style={{ color: "#64748b" }}>No transactions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
