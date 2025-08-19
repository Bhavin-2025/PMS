import axios from "axios";

import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res, 
  (err) => {
    console.error("API Error:", err?.response?.status, err?.message);
    return Promise.reject(err); 
  }
);

export default api;
