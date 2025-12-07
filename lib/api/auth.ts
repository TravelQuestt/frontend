import { LoginPayload } from "@/types/LoginPayload";
import axios from "../axios";
import { RegisterPayload } from "@/types/RegisterPayload";

export async function login(payload: LoginPayload) {
  const res = await axios.post("/user/login", payload);
  return res.data;
}

export async function register(payload: RegisterPayload) {
  const res = await axios.post("/user/register", payload);
  return res.data;
}