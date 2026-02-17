import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

function IncomesPage({ incomes, onAddIncome }) {
  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>Income</h1>

      <IncomeForm onAddIncome={onAddIncome} />

      <IncomeList incomes={incomes} />
    </div>
  );
}

export default IncomesPage;
