import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const createExpense = async (formData) => {
  const response = await axios.post(`${API_URL}/expenses/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateExpense = async (id, formData) => {
  const response = await axios.put(`${API_URL}/expenses/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteExpense = async (id) => {
  await axios.delete(`${API_URL}/expenses/${id}/`);
};

export const getExpenses = async (fullUrl) => {
  const response = await axios.get(fullUrl);
  return response.data;
};