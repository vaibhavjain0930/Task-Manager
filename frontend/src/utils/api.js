import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  if (id) {
    config.headers.id = id;
  }

  return config;
});
