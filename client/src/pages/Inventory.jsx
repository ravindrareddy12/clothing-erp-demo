import { useEffect, useState } from "react";
import { api } from "../api";

const empty = { styleId: "", sku: "", size: "", color: "", stockQty: 0, reorderLevel: 0, costPrice: 0 };

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [styles, setStyles] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = () => {
    api.inventory.list().then(setItems);
    api.pricing.list().then(setStyles);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.styleId) { setError("Select a style"); return; }
    try {
      await api.inventory.create(form);
      setForm(empty);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    await api.inventory.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Inventory</h2>
          <p>SKU-level stock by size and color for each style</p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Add SKU / Variant</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>Style</label>
              <select value={form.styleId} onChange={(e) => setForm({ ...form, styleId: e.target.value })}>
                <option value="">Select style</option>
                {styles.map((s) => (
                  <option key={s.id} value={s.id}>{s.styleCode} — {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label>SKU Code</label>
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SH-101-M-BLU" />
            </div>
            <div>
              <label>Size</label>
              <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="S, M, L, 32, 34..." />
            </div>
            <div>
              <label>Color</label>
              <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label>Opening Stock</label>
              <input type="number" value={form.stockQty} onChange={(e) => setForm({ ...form, stockQty: e.target.value })} />
            </div>
            <div>
              <label>Reorder Level</label>
              <input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
            </div>
            <div>
              <label>Cost Price (₹)</label>
              <input type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
            </div>
          </div>
          <button className="btn" type="submit">Add SKU</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Stock by SKU</h3>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Style</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Color</th>
              <th>Stock Qty</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.sku}</td>
                <td>{i.styleName}</td>
                <td>{i.brand}</td>
                <td><span className="tag">{i.size}</span></td>
                <td><span className="tag">{i.color}</span></td>
                <td>{i.stockQty}</td>
                <td>{i.reorderLevel}</td>
                <td>
                  <span className={`badge ${i.stockQty <= i.reorderLevel ? "low" : "ok"}`}>
                    {i.stockQty <= i.reorderLevel ? "Low Stock" : "OK"}
                  </span>
                </td>
                <td>
                  <button className="btn danger small" onClick={() => remove(i.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
