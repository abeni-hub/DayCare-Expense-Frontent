import React, { useEffect, useState } from "react";
import AccountSummary from "./AccountSummary";
import { getAccounts } from "../../apis/accounts.api";

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      console.log("API Response:", data); // IMPORTANT: check this
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading accounts...</p>;

  if (!accounts || accounts.length === 0)
    return <p>No accounts found.</p>;

  // 🔎 Extract specific accounts safely
  const cashAccount = accounts.find(
    (acc) => acc.account_type === "cash"
  );

  const bankAccount = accounts.find(
    (acc) => acc.account_type === "bank"
  );

  // 💡 Compute combined safely
  const combinedBalance =
    (Number(cashAccount?.balance || 0)) +
    (Number(bankAccount?.balance || 0));

  const combinedAccount = {
    id: "combined",
    name: "Combined Total",
    balance: combinedBalance,
  };

  return (
    <div style={{ padding: "10px" }}>
      <header style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#0f172a",
          }}
        >
          My Accounts
        </h1>
        <p style={{ color: "#64748b" }}>
          Overview of your daycare's financial assets.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          paddingBottom: "20px",
          gap: "20px",
        }}
      >
        {/* Combined Always First */}
        <AccountSummary
          key="combined"
          account={combinedAccount}
          isCombined={true}
        />

        {/* Bank Account */}
        {bankAccount && (
          <AccountSummary
            key={bankAccount.id}
            account={{
              id: bankAccount.id,
              name: bankAccount.name || "Bank",
              balance: Number(bankAccount.balance),
            }}
            isCombined={false}
          />
        )}

        {/* Cash Account */}
        {cashAccount && (
          <AccountSummary
            key={cashAccount.id}
            account={{
              id: cashAccount.id,
              name: cashAccount.name || "Cash",
              balance: Number(cashAccount.balance),
            }}
            isCombined={false}
          />
        )}
      </div>
    </div>
  );
}

export default AccountsPage;
