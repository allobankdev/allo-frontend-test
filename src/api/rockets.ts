import type { ApiResponse } from "@/types/response.type";
import type { Rocket } from "@/types/rocket.type";
import apiInstance from "@/utils/api";

export const fetchData = async (): Promise<ApiResponse<Rocket[]>> => {
  const response = await apiInstance.get("/v4/rockets");
  return response;
};
