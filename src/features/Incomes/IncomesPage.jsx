import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";

import { getIncomes, deleteIncome } from "../../apis/incomes.api";

function IncomesPage() {

  const [incomes, setIncomes] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [viewingIncome, setViewingIncome] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);


  const loadIncomes = async (url = null) => {

    try {

      setLoading(true);

      const data = await getIncomes(url);

      // SAFETY FIX FOR FILTER/MAP ERROR
      const results = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setIncomes(results);

      setNextUrl(data?.next || null);
      setPrevUrl(data?.previous || null);

    } catch (err) {

      console.error(err);
      setError("Failed to load incomes");
      setIncomes([]);

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

      if (viewingIncome && viewingIncome.id === id) {
        setViewingIncome(null);
      }

    } catch (err) {

      console.error(err);
      alert("Failed to delete income");

    }
  };


  const handleEdit = (income) => {

    setViewingIncome(null);
    setEditingIncome(income);
    setIsAdding(true);

  };


  const handleView = (income) => {

    setEditingIncome(null);
    setIsAdding(false);
    setViewingIncome(income);

  };


  const exportToExcel = () => {

    const data = (incomes || []).map((i) => ({

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
      `Income_${new Date().toISOString().slice(0,10)}.xlsx`
    );
  };


  if (loading)
    return <div style={{ padding: "30px" }}>Loading incomes...</div>;

  if (error)
    return <div style={{ padding: "30px", color: "red" }}>{error}</div>;


  return (

    <div style={{ padding: "20px", position: "relative" }}>

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
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            📊 Export to Excel
          </button>

          <button
            onClick={() => {

              setViewingIncome(null);
              setEditingIncome(null);
              setIsAdding(true);

            }}
            style={{
              padding: "10px 20px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
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


      {/* VIEW DETAIL */}

      {viewingIncome && (

        <div style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
          border: "1px solid #cbd5e1",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          position: "relative"
        }}>

          <button
            onClick={() => setViewingIncome(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              fontSize: "16px",
              color: "#64748b",
              cursor: "pointer"
            }}
          >
            ✖ Close
          </button>


          <h2 style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#1e293b"
          }}>
            Transaction Details
          </h2>


          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px"
          }}>

            <div><b>Date</b> {viewingIncome.date}</div>

            <div><b>Category</b> {viewingIncome.category}</div>

            <div><b>Description</b> {viewingIncome.description}</div>

            <div><b>Payment</b> {viewingIncome.payment_source}</div>

            <div><b>Amount</b> {Number(viewingIncome.amount).toLocaleString()} ETB</div>

            <div><b>Paid</b> {Number(viewingIncome.amount_paid || viewingIncome.amount).toLocaleString()} ETB</div>

          </div>

        </div>

      )}


      <IncomeList
        incomes={Array.isArray(incomes) ? incomes : []}
        onDeleteIncome={handleDelete}
        onEditClick={handleEdit}
        onViewClick={handleView}
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