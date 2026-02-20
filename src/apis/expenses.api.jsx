import api from './axios';

// Get all expenses
export const getExpenses = async () => {
  const response = await api.get('/expenses/');
  return response.data;
};

// Create new expense (expects object with nested items)
export const createExpense = async (expenseData) => {
  const response = await api.get('/expenses/', expenseData);
  return response.data;
};

// Delete an expense
export const deleteExpense = async (id) => {
  await api.delete(`/expenses/${id}/`);
};