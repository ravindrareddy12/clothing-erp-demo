import { useEffect, useState } from "react";
import { api } from "../api";

const empty = { name: "", phone: "", email: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  const load = () => api.customers.list().then(setCustomers);
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.customers.create(form);
      setForm(empty);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    await api.customers.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Customers</h2>
          <p>Customer database with visit history and loyalty points</p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Add Customer</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div>
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label>Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <button className="btn" type="submit">Add Customer</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Customer List</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Visits</th>
              <th>Loyalty Points</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.visits}</td>
                <td>{c.loyaltyPoints}</td>
                <td>
                  <button className="btn danger small" onClick={() => remove(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
