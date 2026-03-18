import axios from "axios";

const API_URL = "https://selam-b.naatipharmacy.com/api";

// ✅ CREATE
export const createExpense = async (formData) => {
  const response = await axios.post(
    `${API_URL}/expenses/`,
    formData
    // 🚨 DO NOT set {"Content-Type": "multipart/form-data"} here!
    // Axios sets it automatically with the required boundary string.
  );
  return response.data;
};

// ✅ UPDATE
export const updateExpense = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/expenses/${id}/`,
    formData
    // 🚨 DO NOT set manual headers here either!
  );
  return response.data;
};

// ✅ DELETE
export const deleteExpense = async (id) => {
  const response = await axios.delete(
    `${API_URL}/expenses/${id}/`
  );
  return response.data;
};

// ✅ GET ALL
export const getExpenses = async () => {
  const response = await axios.get(
    `${API_URL}/expenses/`
  );
  return response.data;
};