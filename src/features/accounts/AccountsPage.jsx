import AccountSummary from "./AccountSummary";

function AccountsPage() {
  // Temporary static data (later from API)
  const accounts = [
    {
      id: 1,
      name: "Cash Account",
      balance: 12500,
    },
    {
      id: 2,
      name: "Bank Account",
      balance: 45800,
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: "30px" }}>Accounts Overview</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        {accounts.map((account) => (
          <AccountSummary key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}

export default AccountsPage;
