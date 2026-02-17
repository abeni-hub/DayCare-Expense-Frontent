function AccountSummary({ account }) {
  if (!account) return null;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "25px",
        borderRadius: "10px",
        width: "260px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>
        {account.name}
      </h3>

      <p
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#16a34a",
        }}
      >
        ETB {account.balance?.toLocaleString() ?? 0}
      </p>
    </div>
  );
}

export default AccountSummary;
