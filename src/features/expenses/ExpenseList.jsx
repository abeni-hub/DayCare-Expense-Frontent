import React from 'react';

function ExpenseList({ expenses, onDeleteExpense, onEditClick }) {
  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.total_expense || 0), 0);

  if (!expenses || expenses.length === 0) {
    return <p style={{ textAlign: "center", color: "#64748b", marginTop: "20px" }}>No expenses added yet.</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", fontSize: "14px", color: "#64748b", marginBottom: "15px" }}>
        Showing {expenses.length} expenses |
        <strong style={{ marginLeft: "5px", color: "#1e293b" }}>Total: {totalAmount.toLocaleString()} ETB</strong>
      </div>

      {expenses.map((expense) => (
        <div key={expense.id} style={cardStyle}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <strong style={{ fontSize: "16px", color: "#1e293b" }}>{expense.description}</strong>
              <span style={badgeStyle(expense.payment_source)}>
                {expense.payment_source_display || expense.payment_source}
              </span>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b" }}>
              {expense.date} • <span style={{ color: "#2563eb" }}>{expense.category}</span> • {expense.supplier || "No Supplier"}
            </div>
          </div>

          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "25px" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>{Number(expense.total_expense).toLocaleString()} ETB</div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>{expense.items?.length || 0} items</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => onEditClick(expense)} style={actionBtn}>Edit</button>
              <button onClick={() => onDeleteExpense(expense.id)} style={deleteBtnStyle}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const cardStyle = { background: "#fff", borderRadius: "12px", padding: "20px", marginBottom: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" };
const actionBtn = { padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer" };
const deleteBtnStyle = { padding: "6px 12px", borderRadius: "6px", border: "1px solid #fee2e2", background: "#fff", color: "#dc2626", cursor: "pointer" };
const badgeStyle = (source) => ({ fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "12px", backgroundColor: source === "bank" ? "#eff6ff" : "#fef2f2", color: source === "bank" ? "#2563eb" : "#dc2626" });

export default ExpenseList;