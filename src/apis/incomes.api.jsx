import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/income/';

export const getIncomes = async (url = null) => {
  const response = await axios.get(url || API_BASE);
  return response.data;
};

export const createIncome = async (formData) => {
  const response = await axios.post(API_BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateIncome = async (id, formData) => {
  const response = await axios.put(`${API_BASE}${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteIncome = async (id) => {
  await axios.delete(`${API_BASE}${id}/`);
  return id;
};