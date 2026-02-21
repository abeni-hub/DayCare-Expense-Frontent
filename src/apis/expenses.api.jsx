import axios from "axios";

// ✅ Define your backend base URL here
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create expense
export const createExpense = async (formData) => {
  const response = await axios.post(
    `${API_URL}/expenses`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
};

// Update expense
export const updateExpense = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/expenses/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return response.data;
};