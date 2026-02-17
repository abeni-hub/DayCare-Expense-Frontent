import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";

function ExpensesPage({
  expenses,
  onAddExpense,
  onDeleteExpense,
  onEditExpense,
}) {
  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Expenses</h1>

      <ExpenseForm onAddExpense={onAddExpense} />

      <ExpenseList
        expenses={expenses}
        onDeleteExpense={onDeleteExpense}
        onEditExpense={onEditExpense}
      />
    </div>
  );
}

export default ExpensesPage;
