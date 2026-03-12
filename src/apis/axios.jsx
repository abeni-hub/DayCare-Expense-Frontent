// src/apis/axios.jsx

import axios from "axios";

const instance = axios.create({
  baseURL: "https://selam-b.naatipharmacy.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
