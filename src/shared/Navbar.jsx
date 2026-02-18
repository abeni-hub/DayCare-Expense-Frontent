import { useState } from "react";

function Navbar({ currentView, onViewChange }) {
  const menuItem = (view, label, icon) => {
    const isActive = currentView === view;
    return (
      <div
        onClick={() => onViewChange(view)}
        style={{
          padding: "12px 16px",
          cursor: "pointer",
          backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
          color: isActive ? "#fff" : "#94a3b8",
          marginBottom: "8px",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.2s ease",
          fontWeight: isActive ? "600" : "400",
        }}
      >
        <span style={{ fontSize: "18px" }}>{icon}</span>
        {label}
        {isActive && (
          <div style={{
            marginLeft: "auto",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#3b82f6"
          }} />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#0f172a", // Deep Navy
        padding: "24px 16px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1e293b"
      }}
    >
      <div style={{ padding: "0 16px", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "20px", margin: 0, color: "#fff" }}>Daycare Manager</h2>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "4px 0 0 0" }}>Dual Account System</p>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItem("dashboard", "Dashboard", "📊")}
        {menuItem("accounts", "Accounts", "💳")}
        {menuItem("expenses", "Expenses", "🛒")}
        {menuItem("incomes", "Income", "💰")}
      </nav>

      <div style={{
        marginTop: "auto",
        padding: "16px",
        borderTop: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>A</div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "600" }}>Admin User</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>Logout</div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;