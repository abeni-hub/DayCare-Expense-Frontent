import { useState, useEffect } from "react";

function ExpenseForm({ editingExpense, onSubmit, clearEdit }) {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [supplier, setSupplier] = useState("");
  const [paymentSource, setPaymentSource] = useState("cash");
  const [vatEnabled, setVatEnabled] = useState(false);
  const [vatRate, setVatRate] = useState(0);
  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState([
    { item_name: "", quantity: 1, unit: "pcs", unit_price: 0 }
  ]);

  useEffect(() => {
    if (editingExpense) {
      setDate(editingExpense.date);
      setDescription(editingExpense.description);
      setCategory(editingExpense.category);
      setSupplier(editingExpense.supplier || "");
      setPaymentSource(editingExpense.payment_source);
      setVatEnabled(editingExpense.vat_enabled);
      setVatRate(editingExpense.vat_rate);
      setRemarks(editingExpense.remarks || "");
      setItems(editingExpense.items);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      date,
      description,
      category,
      supplier,
      payment_source: paymentSource,
      vat_enabled: vatEnabled,
      vat_rate: vatRate,
      remarks,
      items,
    };

    if (editingExpense) {
      payload.id = editingExpense.id;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      <input value={description} onChange={e => setDescription(e.target.value)} required />
      <input value={category} onChange={e => setCategory(e.target.value)} />
      <input value={supplier} onChange={e => setSupplier(e.target.value)} />

      <select value={paymentSource} onChange={e => setPaymentSource(e.target.value)}>
        <option value="cash">Cash</option>
        <option value="bank">Bank</option>
      </select>

      <label>
        VAT Enabled
        <input type="checkbox" checked={vatEnabled} onChange={e => setVatEnabled(e.target.checked)} />
      </label>

      {vatEnabled && (
        <input
          type="number"
          value={vatRate}
          onChange={e => setVatRate(e.target.value)}
          placeholder="VAT %"
        />
      )}

      <textarea value={remarks} onChange={e => setRemarks(e.target.value)} />

      <button type="submit">Save</button>
      <button type="button" onClick={clearEdit}>Cancel</button>
    </form>
  );
}

export default ExpenseForm;