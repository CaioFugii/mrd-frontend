import axios from "axios";
import { logoutOn401 } from "./logout-helper";

const api = axios.create({
  baseURL: process.env.REACT_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutOn401();
    }
    return Promise.reject(error);
  }
);

export default api;
