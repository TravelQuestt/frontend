import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";

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
    console.log(status);
    if (status === 401) {
      console.log("logout")
      deleteCookie("auth_token")
      window.location.href = "/login";
      toast.error("Token Expired!")
    }
    return Promise.reject(error);
  }
);

export default instance;
