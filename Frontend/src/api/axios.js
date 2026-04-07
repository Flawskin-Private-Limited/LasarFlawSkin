import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
});

const PUBLIC_ROUTES = [
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/login",
  "/auth/register",
];

api.interceptors.request.use((config) => {

  const url = config.url || "";
  const isPublicRoute = PUBLIC_ROUTES.some(route => url.includes(route));
  if (isPublicRoute) {
    return config; 
  }
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;