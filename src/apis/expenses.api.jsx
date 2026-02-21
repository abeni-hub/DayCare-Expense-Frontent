import axios from "./axios";

export const getExpenses = async () => {
  const response = await axios.get("expenses/");
  // Handle both paginated (results) and non-paginated responses
  return response.data.results || response.data;
};

export const createExpense = async (formData) => {
  // Pass formData directly as the second argument
  const response = await axios.post(`${API_URL}/expenses/`, formData, {
    headers: {
      // Axios usually sets this automatically for FormData,
      // but being explicit helps avoid errors
      'Content-Type': 'multipart/form-data',
    },
  });
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