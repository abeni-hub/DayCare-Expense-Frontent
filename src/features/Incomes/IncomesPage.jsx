import { useState } from "react";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

function IncomesPage({
  incomes,
  onAddIncome,
  onDeleteIncome,
  onEditIncome,
}) {
  const [editingIncome, setEditingIncome] =
    useState(null);

  const handleSubmit = (income) => {
    if (editingIncome) {
      onEditIncome(income);
      setEditingIncome(null);
    } else {
      onAddIncome(income);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Income</h1>

      <IncomeForm
        onSubmit={handleSubmit}
        editingIncome={editingIncome}
        clearEdit={() => setEditingIncome(null)}
      />

      <IncomeList
        incomes={incomes}
        onDeleteIncome={onDeleteIncome}
        onEditClick={setEditingIncome}
      />
    </div>
  );
}

export default IncomesPage;
