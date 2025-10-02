// frontend/src/lib/axiosInstance.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/lms", // sesuaikan base url backend
  headers: {
    Accept: "application/json",
  },
});

// interceptor untuk token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
