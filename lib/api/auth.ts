import { LoginPayload } from "@/types/LoginPayload";
import axios from "../axios";
import { setCookie } from "cookies-next";

export async function login(payload: LoginPayload) {
  // const res = await axios.post("/auth/login", payload); // FIX ME
  const res = {
    data : {
      token : "sss"
    }
  }
  console.log(res.data);
  setCookie("auth_token", res.data.token, {
    path: "/",
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
  });

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