import AccountSummary from "./AccountSummary";

function AccountsPage({ accounts }) {
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
