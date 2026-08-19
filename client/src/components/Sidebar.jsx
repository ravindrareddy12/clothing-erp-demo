const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "billing", label: "Billing / POS" },
  { key: "inventory", label: "Inventory (SKU/Stock)" },
  { key: "stock", label: "Stock In/Out" },
  { key: "pricing", label: "Pricing / Styles" },
  { key: "customers", label: "Customers" }
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Clothing Retail ERP</h1>
        <span>DEMO BUILD</span>
      </div>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.key}
          className={`nav-item ${active === item.key ? "active" : ""}`}
          onClick={() => onNavigate(item.key)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
