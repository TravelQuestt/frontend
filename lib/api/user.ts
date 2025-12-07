import { UserDTO } from "@/types/UserDTO";
import axios from "../axios";

export async function fetchUser(): Promise<UserDTO> {
  const res = await axios.get<UserDTO>("/user/me");
  return res.data;
}
