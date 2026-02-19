import api from './axios';

export const getAccounts = async () => {
  try {
    const response = await api.get('/accounts');
    return response.data; // Assuming backend returns an array of accounts
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};