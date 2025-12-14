import { DashboardStatsDTO } from "@/types/DashboardStatsDTO";
import axios from "../axios";

export async function fetchStats(): Promise<DashboardStatsDTO> {
  const res = await axios.get<DashboardStatsDTO>("/dashboard");
  return res.data;
}
