import { useState } from "react";

function Navbar({ currentView, onViewChange }) {
  const menuItem = (view, label) => (
    <div
      onClick={() => onViewChange(view)}
      style={{
        padding: "12px 20px",
        cursor: "pointer",
        backgroundColor: currentView === view ? "#1e293b" : "transparent",
        color: currentView === view ? "#fff" : "#cbd5e1",
        marginBottom: "5px",
        borderRadius: "6px",
      }}
    >
      {label}
    </div>
  );

  return (
    <div
      style={{
        width: "240px",
        backgroundColor: "#0f172a",
        padding: "20px",
        color: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>Daycare Finance</h2>

      {menuItem("dashboard", "Dashboard")}
      {menuItem("accounts", "Accounts")}
      {menuItem("expenses", "Expenses")}
      {menuItem("incomes", "Income")}
    </div>
  );
}

export default Navbar;
