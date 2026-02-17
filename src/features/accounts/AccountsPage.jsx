import AccountSummary from "./AccountSummary";

function AccountsPage({ accounts = [] }) {
  if (!accounts || accounts.length === 0) {
    return <p>No accounts available.</p>;
  }

  const combinedBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  const combinedAccount = {
    id: "combined",
    name: "Combined Account",
    balance: combinedBalance,
  };

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>
        Accounts Overview
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Combined Account */}
        <AccountSummary account={combinedAccount} />

        {/* Individual Accounts */}
        {accounts.map((account) => (
          <AccountSummary
            key={account.id}
            account={account}
          />
        ))}
      </div>
    </div>
  );
}

export default AccountsPage;
