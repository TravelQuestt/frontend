import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000",
});

instance.interceptors.request.use(
  (config) => {
    const token = getCookie("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      console.log("logout")
      deleteCookie("auth_token")
      sessionStorage.setItem('toast_message', 'Session Expired! Please login again');
      sessionStorage.setItem('toast_type', 'error');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
