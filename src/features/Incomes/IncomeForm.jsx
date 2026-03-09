import React, { useState, useEffect } from "react";
import { createIncome, updateIncome } from "../../apis/incomes.api";

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

  // Shared Tailwind classes for inputs to keep code clean
  const inputClass = "w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {editingIncome ? "Edit Transaction" : "New Transaction"}
        </h3>
        {editingIncome && (
          <button
            type="button"
            onClick={clearEdit}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Transaction Type</label>
            <select className={inputClass} value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="income">Income</option>
              <option value="receivable">Receivable</option>
              <option value="liability">Liability</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
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
            <label className={labelClass}>Transaction Date</label>
            <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>

        {/* Section 2: Payer & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Payer / Customer</label>
            <input type="text" className={inputClass} placeholder="e.g. John Doe" value={payerName} onChange={(e) => setPayerName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <input type="text" className={inputClass} placeholder="Brief description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>

        {/* Section 3: Financials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <label className={labelClass}>Total Amount</label>
            <input type="number" step="0.01" className={inputClass} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Amount Paid</label>
            <input type="number" step="0.01" className={inputClass} placeholder="0.00" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Payment Source</label>
            <select className={inputClass} value={paymentSource} onChange={(e) => setPaymentSource(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="combined">Combined</option>
            </select>
          </div>
        </div>

        {/* Conditional Combined Payment Fields */}
        {paymentSource === "combined" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div>
              <label className={labelClass}>Cash Amount</label>
              <input type="number" step="0.01" className={inputClass} placeholder="0.00" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bank Amount</label>
              <input type="number" step="0.01" className={inputClass} placeholder="0.00" value={bankAmount} onChange={(e) => setBankAmount(e.target.value)} />
            </div>
          </div>
        )}

        {/* Section 4: Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Due Date</label>
            <input type="date" className={inputClass} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Reference Number</label>
            <input type="text" className={inputClass} placeholder="e.g. INV-10293" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Remarks</label>
          <textarea className={`${inputClass} resize-none`} rows="3" placeholder="Any additional notes..." value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingIncome ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IncomeForm;