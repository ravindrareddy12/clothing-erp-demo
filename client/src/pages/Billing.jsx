import { useEffect, useState } from "react";
import { api } from "../api";

export default function Billing() {
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]); // { inventoryId, name, sku, size, color, price, taxPercent, qty, maxQty }
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");
  const [lastBill, setLastBill] = useState(null);

  const load = () => {
    api.inventory.list().then(setInventory);
    api.customers.list().then(setCustomers);
  };
  useEffect(() => { load(); }, []);

  const addToCart = (item) => {
    if (item.stockQty <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.inventoryId === item.id);
      if (existing) {
        if (existing.qty >= item.stockQty) return prev;
        return prev.map((c) => (c.inventoryId === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
      return [...prev, {
        inventoryId: item.id, name: item.styleName, sku: item.sku, size: item.size, color: item.color,
        price: item.price, taxPercent: 0, qty: 1, maxQty: item.stockQty
      }];
    });
  };

  const updateQty = (inventoryId, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.inventoryId !== inventoryId));
    } else {
      setCart((prev) => prev.map((c) => (c.inventoryId === inventoryId ? { ...c, qty: Math.min(qty, c.maxQty) } : c)));
    }
  };

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  // Note: taxPercent per line comes from the style; simplified 5% default shown, actual GST computed server-side per style
  const grandTotalEstimate = subtotal; // exact tax computed server-side on checkout

  const checkout = async () => {
    setError("");
    if (cart.length === 0) { setError("Cart is empty"); return; }
    try {
      const bill = await api.billing.create({
        customerId: customerId || null,
        items: cart.map((c) => ({ inventoryId: c.inventoryId, qty: c.qty }))
      });
      setLastBill(bill);
      setCart([]);
      setCustomerId("");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = [...new Set(inventory.map((i) => i.category))];

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Billing / POS</h2>
          <p>Select SKUs (size/color) and generate the bill — stock deducts automatically</p>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="billing-layout">
        {/* Product selection */}
        <div>
          {categories.map((cat) => (
            <div className="card" key={cat}>
              <h3 style={{ marginTop: 0 }}>{cat}</h3>
              {inventory.filter((i) => i.category === cat).map((i) => (
                <div className="product-card" key={i.id}>
                  <div>
                    <strong>{i.styleName}</strong> <span className="tag">{i.size}</span><span className="tag">{i.color}</span>
                    <div style={{ fontSize: 12.5, color: "#64748b" }}>
                      SKU: {i.sku} · ₹{i.price} · Stock: {i.stockQty}
                    </div>
                  </div>
                  <button className="btn small" disabled={i.stockQty <= 0} onClick={() => addToCart(i)}>
                    {i.stockQty <= 0 ? "Out of stock" : "Add"}
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Cart / bill */}
        <div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Current Order</h3>

            <label>Customer (optional)</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ marginBottom: 14 }}>
              <option value="">Walk-in Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
              ))}
            </select>

            {cart.length === 0 && <p style={{ color: "#64748b", fontSize: 13.5 }}>No items added yet.</p>}

            {cart.map((c) => (
              <div className="cart-line" key={c.inventoryId}>
                <span>{c.name} <span className="tag">{c.size}/{c.color}</span></span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button className="btn secondary small" onClick={() => updateQty(c.inventoryId, c.qty - 1)}>-</button>
                  {c.qty}
                  <button className="btn secondary small" onClick={() => updateQty(c.inventoryId, c.qty + 1)}>+</button>
                  <span style={{ minWidth: 60, textAlign: "right" }}>₹{(c.price * c.qty).toFixed(2)}</span>
                </span>
              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="total-row"><span style={{ color: "#64748b" }}>GST calculated at checkout</span><span></span></div>
                <button className="btn" style={{ width: "100%", marginTop: 12 }} onClick={checkout}>
                  Generate Bill
                </button>
              </>
            )}
          </div>

          {lastBill && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>✅ Bill #{lastBill.id} Generated</h3>
              <p style={{ fontSize: 13.5 }}>Customer: {lastBill.customerName}</p>
              {lastBill.items.map((it, idx) => (
                <div className="cart-line" key={idx}>
                  <span>{it.name} ({it.size}/{it.color}) x{it.qty}</span>
                  <span>₹{it.lineTotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="total-row"><span>Subtotal</span><span>₹{lastBill.subtotal.toFixed(2)}</span></div>
              <div className="total-row"><span>GST</span><span>₹{lastBill.tax.toFixed(2)}</span></div>
              <div className="total-row grand"><span>Grand Total</span><span>₹{lastBill.grandTotal.toFixed(2)}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
