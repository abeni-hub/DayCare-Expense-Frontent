import React from 'react';

function ExpenseList({ expenses, onDeleteExpense, onEditClick }) {
  // Safety check to prevent .reduce crash
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  const totalAmount = safeExpenses.reduce((sum, exp) => sum + Number(exp.total_expense || 0), 0);

  if (safeExpenses.length === 0) {
    return <p style={{ textAlign: "center", color: "#64748b", marginTop: "20px" }}>No expenses found.</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", fontSize: "14px", color: "#64748b", marginBottom: "15px", padding: "0 10px" }}>
        Showing {safeExpenses.length} expenses |
        <strong style={{ marginLeft: "5px", color: "#1e293b" }}>Total: {totalAmount.toLocaleString()} ETB</strong>
      </div>

      {safeExpenses.map((expense) => (
        <div key={expense.id} style={listItemContainer}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <strong style={{ fontSize: "16px", color: "#1e293b" }}>{expense.description}</strong>
              <span style={badgeStyle(expense.payment_source)}>
                {expense.payment_source_display || expense.payment_source?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              {expense.date} • <span style={{ color: "#2563eb", margin: "0 5px" }}>{expense.category}</span> • {expense.supplier || "No Supplier"}
            </div>
          </div>

          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "25px" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b" }}>
                {Number(expense.total_expense).toLocaleString()} ETB
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                {expense.items?.length || 0} items
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => onEditClick(expense)} style={editBtn}>Edit</button>
              <button onClick={() => onDeleteExpense(expense.id)} style={deleteBtn}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const listItemContainer = { background: "#fff", borderRadius: "12px", padding: "20px", marginBottom: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" };
const editBtn = { padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: "13px" };
const deleteBtn = { padding: "6px 12px", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", cursor: "pointer", fontSize: "13px" };
const badgeStyle = (source) => ({
  fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "12px",
  backgroundColor: source === "bank" ? "#eff6ff" : "#fef2f2",
  color: source === "bank" ? "#2563eb" : "#dc2626",
  border: "1px solid currentColor"
});

export default ExpenseList;