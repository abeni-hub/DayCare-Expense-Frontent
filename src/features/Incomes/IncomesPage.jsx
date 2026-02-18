import { useState } from "react";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

function IncomesPage({ incomes, onAddIncome, onDeleteIncome, onEditIncome }) {
  const [editingIncome, setEditingIncome] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (income) => {
    if (editingIncome) {
      onEditIncome(income);
      setEditingIncome(null);
    } else {
      onAddIncome(income);
    }
    setIsFormOpen(false);
  };

  const handleEditClick = (income) => {
    setEditingIncome(income);
    setIsFormOpen(true);
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            Income Tracking
          </h1>
          <p style={{ color: "#64748b", marginTop: "4px" }}>Manage student fees and other revenue sources.</p>
        </div>

        <button
          onClick={() => {
            setEditingIncome(null);
            setIsFormOpen(!isFormOpen);
          }}
          style={{
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {isFormOpen ? "✕ Close" : "+ Add Income"}
        </button>
      </div>

      {isFormOpen && (
        <div style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
          border: "1px solid #f1f5f9",
          marginBottom: "30px",
          animation: "slideDown 0.3s ease-out"
        }}>
          <IncomeForm
            onSubmit={handleSubmit}
            editingIncome={editingIncome}
            clearEdit={() => {
              setEditingIncome(null);
              setIsFormOpen(false);
            }}
          />
        </div>
      )}

      <IncomeList
        incomes={incomes}
        onDeleteIncome={onDeleteIncome}
        onEditClick={handleEditClick}
      />
    </div>
  );
}

export default IncomesPage;