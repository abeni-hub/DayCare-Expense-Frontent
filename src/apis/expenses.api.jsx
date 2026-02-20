import axios from "./axios";

export const getExpenses = async () => {
  const response = await axios.get("expenses/");
  // Handle both paginated (results) and non-paginated responses
  return response.data.results || response.data;
};

export const createExpense = async (data) => {
  const response = await axios.post("expenses/", data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await axios.put(`expenses/${id}/`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`expenses/${id}/`);
  return response.data;
};