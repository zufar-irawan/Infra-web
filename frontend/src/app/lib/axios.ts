// === app/lib/axios.ts ===
// Instance Axios dengan token otomatis dari sessionStorage

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.smkprestasiprima.sch.id/api",
  headers: {
    Accept: "application/json",
  },
});

// Auto attach token sebelum setiap request
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;
