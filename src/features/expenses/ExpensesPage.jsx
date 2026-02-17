import { useState } from "react";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Expenses</h1>

      <ExpenseForm onAddExpense={addExpense} />

      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default ExpensesPage;
