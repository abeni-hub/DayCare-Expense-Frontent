import React from 'react';

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
      <h3 style={{ fontSize: "16px", color: "#475569", marginBottom: "8px" }}>Recent Income Transactions</h3>

      {incomes.map((income) => (
        <div key={income.id} style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
        }}>
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
              <div style={{ fontWeight: "700", color: "#1e293b" }}>{income.description}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                {income.date} • <span style={{ color: "#10b981", fontWeight: "600" }}>{income.category}</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "800", color: "#10b981", fontSize: "18px" }}>
                + {Number(income.amount).toLocaleString()} ETB
              </div>
              {income.payment_source === "combined" && (
                <div style={{ fontSize: "12px", color: "#64748b" }}>
                  Cash: {income.amount_cash} | Bank: {income.amount_bank}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => onEditClick(income)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" }}>Edit</button>
              <button onClick={() => onDeleteIncome(income.id)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default IncomeList;