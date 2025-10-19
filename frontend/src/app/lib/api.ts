import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "https://api.smkprestasiprima.sch.id/api",
  headers: { "Content-Type": "application/json" },
});

// 🔥 Tambahkan interceptor untuk kirim token otomatis
api.interceptors.request.use((config) => {
  const token = Cookies.get("portal-auth-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
