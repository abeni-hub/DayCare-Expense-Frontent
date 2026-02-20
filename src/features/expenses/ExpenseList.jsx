import React from 'react';

function ExpenseList({ expenses, onDeleteExpense, onEditClick }) {
  // Calculate total across all expenses for the stats bar
  const totalAmount = expenses.reduce((sum, exp) => sum + (exp.total || 0), 0);

  if (!expenses || expenses.length === 0) {
    return <p style={{ textAlign: "center", color: "#64748b", marginTop: "20px" }}>No expenses added yet.</p>;
  }

  return (
    <div className="expense-list-container" style={{ marginTop: "20px" }}>
      {/* Stats Bar matching Screenshot 1 */}
      <div style={{
        display: "flex",
        justifyContent: "flex-start",
        fontSize: "14px",
        color: "#64748b",
        marginBottom: "15px",
        padding: "0 10px"
      }}>
        Showing {expenses.length} of {expenses.length} expenses |
        <strong style={{ marginLeft: "5px", color: "#1e293b" }}>Total: {totalAmount.toLocaleString()} ETB</strong>
      </div>

      {expenses.map((expense) => (
        <div
          key={expense.id}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "12px",
            border: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}
        >
          {/* Left Side: Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <strong style={{ fontSize: "16px", color: "#1e293b" }}>{expense.description}</strong>
              <span style={{
                fontSize: "10px",
                fontWeight: "bold",
                padding: "2px 8px",
                borderRadius: "12px",
                backgroundColor: expense.paymentSource === "Both" ? "#f5f3ff" : (expense.paymentSource === "Bank" ? "#eff6ff" : "#fef2f2"),
                color: expense.paymentSource === "Both" ? "#7c3aed" : (expense.paymentSource === "Bank" ? "#2563eb" : "#dc2626"),
                border: "1px solid currentColor"
              }}>
                {expense.paymentSource?.toUpperCase()}
              </span>
            </div>

            <div style={{ fontSize: "13px", color: "#64748b" }}>
              {expense.date} •
              <span style={{ color: "#2563eb", margin: "0 5px" }}>{expense.category}</span> •
              {expense.supplier || "No Supplier"}
            </div>

            {/* Show split details if payment is "Both" */}
            {expense.paymentSource === "Both" && (
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                Cash: {Number(expense.cashAmount).toLocaleString()} | Bank: {Number(expense.bankAmount).toLocaleString()}
              </div>
            )}
          </div>

          {/* Right Side: Totals and Actions */}
          <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "25px" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1e293b" }}>
                {expense.total?.toLocaleString()} ETB
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                {expense.items?.length || 0} items {expense.vatAmount > 0 && `(Incl. VAT)`}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => onEditClick(expense)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteExpense(expense.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #fee2e2",
                  background: "#fff",
                  color: "#dc2626",
                  cursor: "pointer",
                  fontSize: "13px"
                }}
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

export default ExpenseList;