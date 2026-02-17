import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

function ExpensesPage({ expenses, onAddExpense }) {
  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Expenses</h1>

      <ExpenseForm onAddExpense={onAddExpense} />

      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default ExpensesPage;
