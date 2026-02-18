function IncomeList({ incomes, onDeleteIncome, onEditClick }) {
  if (incomes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
        <p style={{ color: "#94a3b8", fontSize: "16px" }}>No income transactions recorded yet.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{ fontSize: "16px", color: "#475569", marginBottom: "8px" }}>Recent Transactions</h3>

      {incomes.map((income) => (
        <div
          key={income.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #f1f5f9",
            transition: "transform 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#ecfdf5",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px"
            }}>
              ↓
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#1e293b" }}>{income.title}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                <span style={{
                  backgroundColor: "#f1f5f9",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  marginRight: "8px",
                  color: "#475569",
                  fontWeight: "600"
                }}>
                  {income.account.toUpperCase()}
                </span>
                {income.date}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "800", color: "#10b981", fontSize: "18px" }}>
                + {income.amount.toLocaleString()} <span style={{ fontSize: "12px" }}>ETB</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onEditClick(income)}
                style={actionButtonStyle}
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteIncome(income.id)}
                style={{ ...actionButtonStyle, color: "#ef4444" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const actionButtonStyle = {
  background: "none",
  border: "none",
  color: "#3b82f6",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  padding: "4px 8px"
};

export default IncomeList;