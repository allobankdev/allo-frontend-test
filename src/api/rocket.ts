import axios from "axios";
import type { TRocket } from "@/types/rocket";

const api = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
});

export const getRockets = async (): Promise<TRocket[]> => {
  const res = await api.get("/rockets");
  return res.data;
};

export const getRocketById = async (id: string): Promise<TRocket> => {
  const res = await api.get(`/rockets/${id}`);
  return res.data;
};
