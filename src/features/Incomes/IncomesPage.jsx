import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

function IncomesPage({
  incomes,
  onAddIncome,
  onDeleteIncome,
  onEditIncome,
}) {
  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Income</h1>

      <IncomeForm onAddIncome={onAddIncome} />

      <IncomeList
        incomes={incomes}
        onDeleteIncome={onDeleteIncome}
        onEditIncome={onEditIncome}
      />
    </div>
  );
}

export default IncomesPage;
