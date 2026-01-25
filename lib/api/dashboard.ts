import { DashboardStatsDTO } from "@/types/DashboardStatsDTO";
import axios from "../axios";
import { DashboardGraphDTO } from "@/types/DashboardGraphDTO";

export async function fetchStats(): Promise<DashboardStatsDTO> {
  const res = await axios.get<DashboardStatsDTO>("/dashboard");
  return res.data;
}

export async function fetchGraphStats(): Promise<DashboardGraphDTO[]> {
  const res = await axios.get<DashboardGraphDTO[]>("/dashboard/graph");
  return res.data;
}
