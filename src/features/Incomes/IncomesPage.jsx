import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

import { getIncomes, deleteIncome } from "../../apis/incomes.api";

function IncomesPage() {

  const [incomes, setIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);


  const loadIncomes = async (url = null) => {

    try {

      setLoading(true);

      const data = await getIncomes(url);

      setIncomes(data.results || []);
      setNextUrl(data.next);
      setPrevUrl(data.previous);

    } catch (err) {

      console.error(err);
      setError("Failed to load incomes");

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadIncomes();

  }, []);


  const handleFormSubmit = () => {

    loadIncomes();
    setEditingIncome(null);
    setIsAdding(false);

  };


  const handleDelete = async (id) => {

    if (!window.confirm("Delete this income?")) return;

    try {

      await deleteIncome(id);
      loadIncomes();

    } catch (err) {

      console.error(err);
      alert("Failed to delete income");

    }
  };


  const handleEdit = (income) => {

    setEditingIncome(income);
    setIsAdding(true);

  };


  const exportToExcel = () => {

    const data = incomes.map(i => ({

      Date: i.date,
      Description: i.description,
      Category: i.category,

      Amount: i.amount,

      Payment_Source: i.payment_source,

      Cash_Amount: i.amount_cash || 0,
      Bank_Amount: i.amount_bank || 0,

      Liability: i.liability_amount || 0,
      Receivable: i.receivable_amount || 0,

      Remarks: i.remarks || ""

    }));


    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Income");

    XLSX.writeFile(
      wb,
      `Income_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };


  if (loading)
    return <div style={{ padding: "30px" }}>Loading incomes...</div>;


  return (

    <div style={{ padding: "20px" }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px"
      }}>

        <h1 style={{
          fontSize: "28px",
          fontWeight: "800"
        }}>
          Income Tracking
        </h1>

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            onClick={exportToExcel}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "8px"
            }}
          >
            📊 Export to Excel
          </button>

          <button
            onClick={() => {
              setEditingIncome(null);
              setIsAdding(true);
            }}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px"
            }}
          >
            + Add Income
          </button>

        </div>

      </div>


      {(isAdding || editingIncome) && (

        <div style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
          border: "1px solid #e2e8f0"
        }}>

          <IncomeForm
            onSubmit={handleFormSubmit}
            editingIncome={editingIncome}
            clearEdit={() => {
              setEditingIncome(null);
              setIsAdding(false);
            }}
          />

        </div>

      )}


      <IncomeList
        incomes={incomes}
        onDeleteIncome={handleDelete}
        onEditClick={handleEdit}
      />


      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "30px"
      }}>

        <button
          onClick={() => prevUrl && loadIncomes(prevUrl)}
          disabled={!prevUrl}
          style={{
            padding: "10px 20px",
            background: prevUrl ? "#2563eb" : "#e2e8f0",
            color: prevUrl ? "#fff" : "#94a3b8",
            border: "none",
            borderRadius: "8px"
          }}
        >
          ← Previous
        </button>

        <button
          onClick={() => nextUrl && loadIncomes(nextUrl)}
          disabled={!nextUrl}
          style={{
            padding: "10px 20px",
            background: nextUrl ? "#2563eb" : "#e2e8f0",
            color: nextUrl ? "#fff" : "#94a3b8",
            border: "none",
            borderRadius: "8px"
          }}
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default IncomesPage;