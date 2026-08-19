import { useEffect, useState } from "react";
import { api } from "../api";

const empty = { styleCode: "", name: "", brand: "", category: "", price: "", taxPercent: 5 };

export default function Pricing() {
  const [styles, setStyles] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = () => api.pricing.list().then(setStyles);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.pricing.create(form);
      setForm(empty);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePrice = async (style, newPrice) => {
    await api.pricing.update(style.id, { price: Number(newPrice) });
    load();
  };

  const remove = async (id) => {
    await api.pricing.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Pricing / Styles</h2>
          <p>Manage clothing styles, brands, categories, price and GST rate</p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Add Style</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>Style Code</label>
              <input required value={form.styleCode} onChange={(e) => setForm({ ...form, styleCode: e.target.value })} placeholder="SH-101" />
            </div>
            <div>
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Men's Cotton Shirt" />
            </div>
            <div>
              <label>Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div>
              <label>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Shirts, Jeans, Kurtis..." />
            </div>
            <div>
              <label>Price (₹)</label>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label>GST %</label>
              <input type="number" step="0.01" value={form.taxPercent} onChange={(e) => setForm({ ...form, taxPercent: e.target.value })} />
            </div>
          </div>
          <button className="btn" type="submit">Add Style</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Style Catalog</h3>
        <table>
          <thead>
            <tr>
              <th>Style Code</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Price (₹)</th>
              <th>GST %</th>
              <th>Price incl. tax</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {styles.map((s) => (
              <tr key={s.id}>
                <td>{s.styleCode}</td>
                <td>{s.name}</td>
                <td>{s.brand}</td>
                <td>{s.category}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={s.price}
                    style={{ width: 90 }}
                    onBlur={(e) => e.target.value != s.price && updatePrice(s, e.target.value)}
                  />
                </td>
                <td>{s.taxPercent}%</td>
                <td>₹{(s.price * (1 + s.taxPercent / 100)).toFixed(2)}</td>
                <td>
                  <button className="btn danger small" onClick={() => remove(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
