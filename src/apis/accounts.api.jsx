// src/apis/accounts.api.jsx

import axios from "./axios";

export const getAccounts = async () => {
  const response = await axios.get("accounts/");
  return response.data;
};
