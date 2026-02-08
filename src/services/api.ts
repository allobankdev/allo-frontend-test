import axios from "axios";
import type { Rocket } from "@/types/rocket";

const API_URL = "https://api.spacexdata.com/v4/rockets";

export const fetchRockets = async (): Promise<Rocket[]> => {
  const response = await axios.get<Rocket[]>(API_URL);
  return response.data;
};
