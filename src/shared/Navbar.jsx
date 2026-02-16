function Navbar({ currentView, onViewChange }) {
  const buttonStyle = (view) => ({
    marginRight: "10px",
    padding: "8px 12px",
    backgroundColor: currentView === view ? "#333" : "#ccc",
    color: currentView === view ? "#fff" : "#000",
    border: "none",
    cursor: "pointer",
  });

  return (
    <div style={{ padding: "15px", background: "#f5f5f5" }}>
      <button style={buttonStyle("dashboard")} onClick={() => onViewChange("dashboard")}>
        Dashboard
      </button>

      <button style={buttonStyle("accounts")} onClick={() => onViewChange("accounts")}>
        Accounts
      </button>

      <button style={buttonStyle("expenses")} onClick={() => onViewChange("expenses")}>
        Expenses
      </button>

      <button style={buttonStyle("income")} onClick={() => onViewChange("income")}>
        Income
      </button>
    </div>
  );
}

export default Navbar;
