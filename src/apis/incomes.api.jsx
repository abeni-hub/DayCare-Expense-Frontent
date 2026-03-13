import axios from "./axios";

export const getIncomes = async (url = null) => {
  const response = await axios.get(url || "incomes/");
  return response.data;
};

export const createIncome = async (data) => {
  const response = await axios.post("incomes/", data);
  return response.data;
};

export const updateIncome = async (id, data) => {
  const response = await axios.put(`incomes/${id}/`, data);
  return response.data;
};

export const deleteIncome = async (id) => {
  await axios.delete(`incomes/${id}/`);
};