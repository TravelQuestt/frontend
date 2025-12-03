import { LoginPayload } from "@/types/LoginPayload";
import axios from "../axios";

export async function login(payload: LoginPayload) {
  const res = await axios.post("/auth/login", payload);
  console.log(res.data);
  return res.data;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const res = await axios.post("/auth/register", data);
  return res.data;
}