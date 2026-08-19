import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inventory from "./pages/Inventory.jsx";
import Stock from "./pages/Stock.jsx";
import Pricing from "./pages/Pricing.jsx";
import Customers from "./pages/Customers.jsx";
import Billing from "./pages/Billing.jsx";

const PAGES = {
  dashboard: Dashboard,
  billing: Billing,
  inventory: Inventory,
  stock: Stock,
  pricing: Pricing,
  customers: Customers
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const Page = PAGES[active];

  return (
    <div className="app-layout">
      <Sidebar active={active} onNavigate={setActive} />
      <div className="main-content">
        <Page />
      </div>
    </div>
  );
}
