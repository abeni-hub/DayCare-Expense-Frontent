import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// ✅ CREATE
export const createExpense = async (formData) => {
  const response = await axios.post(
    `${API_URL}/expenses/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// ✅ UPDATE
export const updateExpense = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/expenses/${id}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// ✅ DELETE  🔥 THIS WAS MISSING
export const deleteExpense = async (id) => {
  const response = await axios.delete(
    `${API_URL}/expenses/${id}/`
  );
  return response.data;
};

// ✅ GET ALL (optional but recommended)
export const getExpenses = async () => {
  const response = await axios.get(
    `${API_URL}/expenses/`
  );
  return response.data;
};