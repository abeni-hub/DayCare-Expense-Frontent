import React, { useState, useEffect } from "react";
import { createIncome, updateIncome } from "../../apis/incomes.api";

function IncomeForm({ onSubmit, editingIncome, clearEdit }) {

  const today = new Date().toISOString().split("T")[0];

  const [transactionType, setTransactionType] = useState("income");
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [payerName, setPayerName] = useState("");
  const [category, setCategory] = useState("salary");

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
      setCategory(editingIncome.category || "salary");

      setAmount(editingIncome.amount || "");
      setAmountPaid(editingIncome.amount_paid || "");

      setPaymentSource(editingIncome.payment_source || "cash");

      setCashAmount(editingIncome.amount_cash || 0);
      setBankAmount(editingIncome.amount_bank || 0);

      setDueDate(editingIncome.due_date || "");
      setReferenceNumber(editingIncome.reference_number || "");
      setRemarks(editingIncome.remarks || "");
    }
  }, [editingIncome]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentSource === "combined") {
      const total = Number(cashAmount) + Number(bankAmount);

      if (Math.abs(total - Number(amountPaid)) > 0.01) {
        alert("Cash + Bank must equal Amount Paid");
        return;
      }
    }

    try {

      const formData = new FormData();

      formData.append("transaction_type", transactionType);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("payer_name", payerName);
      formData.append("category", category);

      formData.append("amount", amount);
      formData.append("amount_paid", amountPaid);

      formData.append("payment_source", paymentSource);

      formData.append("due_date", dueDate || "");
      formData.append("reference_number", referenceNumber || "");

      formData.append("remarks", remarks || "");

      if (paymentSource === "combined") {
        formData.append("amount_cash", cashAmount);
        formData.append("amount_bank", bankAmount);
      }

      let res;

      if (editingIncome) {
        res = await updateIncome(editingIncome.id, formData);
      } else {
        res = await createIncome(formData);
      }

      onSubmit(res);

      if (clearEdit) clearEdit();

      // reset
      setDescription("");
      setAmount("");
      setAmountPaid("");
      setPayerName("");
      setRemarks("");
      setCashAmount(0);
      setBankAmount(0);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Error saving income");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h3>{editingIncome ? "Edit Transaction" : "New Transaction"}</h3>

      {/* TRANSACTION TYPE */}

      <select value={transactionType} onChange={(e)=>setTransactionType(e.target.value)}>

        <option value="income">Income</option>
        <option value="receivable">Receivable</option>
        <option value="liability">Liability</option>

      </select>


      <input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
      />

      <input
        type="text"
        placeholder="Payer / Customer"
        value={payerName}
        onChange={(e)=>setPayerName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Total Amount"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount Paid"
        value={amountPaid}
        onChange={(e)=>setAmountPaid(e.target.value)}
      />

      <select
        value={paymentSource}
        onChange={(e)=>setPaymentSource(e.target.value)}
      >
        <option value="cash">Cash</option>
        <option value="bank">Bank</option>
        <option value="combined">Combined</option>
      </select>


      {paymentSource === "combined" && (
        <>
          <input
            type="number"
            placeholder="Cash Amount"
            value={cashAmount}
            onChange={(e)=>setCashAmount(e.target.value)}
          />

          <input
            type="number"
            placeholder="Bank Amount"
            value={bankAmount}
            onChange={(e)=>setBankAmount(e.target.value)}
          />
        </>
      )}


      <input
        type="date"
        value={dueDate}
        onChange={(e)=>setDueDate(e.target.value)}
      />

      <input
        type="text"
        placeholder="Reference Number"
        value={referenceNumber}
        onChange={(e)=>setReferenceNumber(e.target.value)}
      />

      <textarea
        placeholder="Remarks"
        value={remarks}
        onChange={(e)=>setRemarks(e.target.value)}
      />

      <button type="submit">
        {editingIncome ? "Update" : "Create"}
      </button>

    </form>
  );
}

export default IncomeForm;