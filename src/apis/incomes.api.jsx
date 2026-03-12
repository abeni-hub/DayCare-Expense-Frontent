import axios from 'axios';

const API_BASE = 'https://selam-b.naatipharmacy.com/api/incomes/';

export const getIncomes = async (url = null) => {
  const response = await axios.get(url || API_BASE);
  return response.data;
};

export const createIncome = async (data) => {
  const response = await axios.post(API_BASE, data);
  return response.data;
};

export const updateIncome = async (id, data) => {
  const response = await axios.put(`${API_BASE}${id}/`, data);
  return response.data;
};

export const deleteIncome = async (id) => {
  await axios.delete(`${API_BASE}${id}/`);
  return id;
};