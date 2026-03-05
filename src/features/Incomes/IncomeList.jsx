import React from "react";

function IncomeList({ incomes, onDeleteIncome, onEditClick }) {

  if (!incomes || incomes.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "60px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px dashed #cbd5e1"
      }}>
        <p style={{ color: "#94a3b8", fontSize: "16px" }}>
          No income transactions recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      <h3 style={{
        fontSize: "16px",
        color: "#475569",
        marginBottom: "10px"
      }}>
        Recent Income Transactions
      </h3>

      {incomes.map((income) => (
        <div
          key={income.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
          }}
        >

          {/* LEFT SIDE */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

            <div style={{
              width: "42px",
              height: "42px",
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

              <div style={{
                fontWeight: "700",
                color: "#1e293b"
              }}>
                {income.description}
              </div>

              <div style={{
                fontSize: "12px",
                color: "#94a3b8"
              }}>
                {income.date} •{" "}
                <span style={{
                  color: "#10b981",
                  fontWeight: "600"
                }}>
                  {income.category}
                </span>
              </div>

              {/* Payment info */}
              <div style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "4px"
              }}>
                Payment: {income.payment_source}
              </div>

              {/* Combined payment */}
              {income.payment_source === "combined" && (
                <div style={{
                  fontSize: "12px",
                  color: "#64748b"
                }}>
                  Cash: {income.amount_cash || 0} | Bank: {income.amount_bank || 0}
                </div>
              )}

              {/* Liability */}
              {income.liability_amount > 0 && (
                <div style={{
                  fontSize: "12px",
                  color: "#dc2626"
                }}>
                  Liability: {Number(income.liability_amount).toLocaleString()} ETB
                </div>
              )}

              {/* Receivable */}
              {income.receivable_amount > 0 && (
                <div style={{
                  fontSize: "12px",
                  color: "#f59e0b"
                }}>
                  Receivable: {Number(income.receivable_amount).toLocaleString()} ETB
                </div>
              )}

            </div>
          </div>


          {/* RIGHT SIDE */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px"
          }}>

            <div style={{ textAlign: "right" }}>
              <div style={{
                fontWeight: "800",
                color: "#10b981",
                fontSize: "18px"
              }}>
                + {Number(income.amount).toLocaleString()} ETB
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>

              <button
                onClick={() => onEditClick(income)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                Edit
              </button>

              <button
                onClick={() => onDeleteIncome(income.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #fee2e2",
                  background: "#fff",
                  color: "#dc2626",
                  cursor: "pointer"
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

export default IncomeList;