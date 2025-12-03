import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.sourav.fyi/api",
  withCredentials: true, // important for HttpOnly cookies
});

export default instance;
