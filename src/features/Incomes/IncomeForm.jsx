import React, { useState, useEffect } from "react";
import { createIncome, updateIncome } from "../../apis/incomes.api";

// Extracted styles object for clean inline styling
const styles = {
  container: {
    maxWidth: "896px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    border: "1px solid #f3f4f6",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    boxSizing: "border-box"
  },
  header: {
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "1rem"
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0
  },
  cancelButton: {
    fontSize: "0.875rem",
    color: "#6b7280",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem"
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem"
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem"
  },
  financialSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1.5rem",
    backgroundColor: "#f9fafb",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #f3f4f6"
  },
  combinedSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    backgroundColor: "#eff6ff",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid #dbeafe"
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "0.25rem"
  },
  input: {
    width: "100%",
    padding: "0.5rem 1rem",
    marginTop: "0.25rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
    boxSizing: "border-box",
    fontSize: "0.875rem",
    backgroundColor: "#ffffff",
    outline: "none"
  },
  textarea: {
    width: "100%",
    padding: "0.5rem 1rem",
    marginTop: "0.25rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
    boxSizing: "border-box",
    fontSize: "0.875rem",
    resize: "none",
    backgroundColor: "#ffffff",
    outline: "none"
  },
  buttonContainer: {
    paddingTop: "1rem",
    display: "flex",
    justifyContent: "flex-end"
  },
  submitButton: {
    padding: "0.625rem 1.5rem",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: "500",
    borderRadius: "0.5rem",
    border: "none",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    cursor: "pointer",
    fontSize: "0.875rem"
  }
};

function IncomeForm({ onSubmit, editingIncome, clearEdit }) {
  const today = new Date().toISOString().split("T")[0];

  const [transactionType, setTransactionType] = useState("income");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [payerName, setPayerName] = useState("");
  const [category, setCategory] = useState("other");

  const [amount, setAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  const [paymentSource, setPaymentSource] = useState("cash");
  const [cashAmount, setCashAmount] = useState(0);
  const [bankAmount, setBankAmount] = useState(0);

  const [dueDate, setDueDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (editingIncome) {
      setTransactionType(editingIncome.transaction_type || "income");
      setDate(editingIncome.date || today);
      setDescription(editingIncome.description || "");
      setPayerName(editingIncome.payer_name || "");
      setCategory(editingIncome.category || "other");
      setAmount(editingIncome.amount || "");
      setAmountPaid(editingIncome.amount_paid || "");
      setPaymentSource(editingIncome.payment_source || "cash");
      setCashAmount(editingIncome.amount_cash || 0);
      setBankAmount(editingIncome.amount_bank || 0);
      setDueDate(editingIncome.due_date || "");
      setReferenceNumber(editingIncome.reference_number || "");
      setRemarks(editingIncome.remarks || "");
    }
  }, [editingIncome, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numericAmountPaid = Number(amountPaid);
    const numericCash = Number(cashAmount);
    const numericBank = Number(bankAmount);

    if (paymentSource === "combined") {
      const total = numericCash + numericBank;
      if (Math.abs(total - numericAmountPaid) > 0.01) {
        alert("Cash + Bank must equal Amount Paid");
        return;
      }
    }

    try {
      const payload = {
        transaction_type: transactionType,
        date: date,
        description: description,
        payer_name: payerName,
        category: category,
        amount: Number(amount),
        amount_paid: numericAmountPaid,
        payment_source: paymentSource,
        due_date: dueDate ? dueDate : null,
        reference_number: referenceNumber,
        remarks: remarks,
        amount_cash: paymentSource === "combined" ? numericCash : 0,
        amount_bank: paymentSource === "combined" ? numericBank : 0,
      };

      let res;
      if (editingIncome) {
        res = await updateIncome(editingIncome.id, payload);
      } else {
        res = await createIncome(payload);
      }

      onSubmit(res);
      if (clearEdit) clearEdit();

      // Reset form
      setDescription("");
      setAmount("");
      setAmountPaid("");
      setPayerName("");
      setCategory("other");
      setRemarks("");
      setCashAmount(0);
      setBankAmount(0);
      setDueDate("");
      setReferenceNumber("");

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Error saving income";
      alert(`Failed: ${errorMsg}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {editingIncome ? "Edit Transaction" : "New Transaction"}
        </h3>
        {editingIncome && (
          <button
            type="button"
            onClick={clearEdit}
            style={styles.cancelButton}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Section 1: Core Details */}
        <div style={styles.grid3}>
          <div>
            <label style={styles.label}>Transaction Type</label>
            <select style={styles.input} value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="income">Income</option>
              <option value="receivable">Receivable</option>
              <option value="liability">Liability</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Category</label>
            <select style={styles.input} value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="tuition_fee">Child Tuition Fee</option>
              <option value="registration_fee">Registration Fee</option>
              <option value="late_fee">Late Payment Fee</option>
              <option value="meal_fee">Meal Fee</option>
              <option value="activity_fee">Activity Fee</option>
              <option value="donation">Donation</option>
              <option value="sales">Sales</option>
              <option value="investment">Investment</option>
              <option value="other">Other Income</option>
            </select>
          </div>
          <div>
            <label style={styles.label}>Transaction Date</label>
            <input type="date" style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        {/* Section 2: Payer & Description */}
        <div style={styles.grid2}>
          <div>
            <label style={styles.label}>Payer / Customer</label>
            <input type="text" style={styles.input} placeholder="e.g. John Doe" value={payerName} onChange={(e) => setPayerName(e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Description</label>
            <input type="text" style={styles.input} placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        {/* Section 3: Financials */}
        <div style={styles.financialSection}>
          <div>
            <label style={styles.label}>Total Amount</label>
            <input type="number" step="0.01" style={styles.input} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label style={styles.label}>Amount Paid</label>
            <input type="number" step="0.01" style={styles.input} placeholder="0.00" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} required />
          </div>
          <div>
            <label style={styles.label}>Payment Source</label>
            <select style={styles.input} value={paymentSource} onChange={(e) => setPaymentSource(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="combined">Combined</option>
            </select>
          </div>
        </div>

        {/* Conditional Combined Payment Fields */}
        {paymentSource === "combined" && (
          <div style={styles.combinedSection}>
            <div>
              <label style={styles.label}>Cash Amount</label>
              <input type="number" step="0.01" style={styles.input} placeholder="0.00" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Bank Amount</label>
              <input type="number" step="0.01" style={styles.input} placeholder="0.00" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} />
            </div>
          </div>
        )}

        {/* Section 4: Metadata */}
        <div style={styles.grid2}>
          <div>
            <label style={styles.label}>Due Date</label>
            <input type="date" style={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label style={styles.label}>Reference Number</label>
            <input type="text" style={styles.input} placeholder="e.g. INV-10293" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={styles.label}>Remarks</label>
          <textarea style={styles.textarea} rows="3" placeholder="Any additional notes..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        {/* Submit Button */}
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton}>
            {editingIncome ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IncomeForm;