import apiInstance from "@/lib/api";
import type { ApiResponse, queryData } from "@/types/api.type";
import type { Rocket } from "@/types/rocket.type";

export const getRocketByFilter = async (
  name: string,
  active: string | null
): Promise<ApiResponse<Rocket[]>> => {
  const query: queryData = {
    name: {
      $regex: name,
      $options: "i",
    },
  };

  if (active && active !== "All") {
    query.active = active === "active";
  }

  const { data } = await apiInstance.post("/v4/rockets/query", {
    query,
    options: {},
  });
  return data;
};

export const getRocketById = async (id: string) => {
  const response = await apiInstance.get<Rocket>(`/v4/rockets/${id}`);
  return { data: response.data };
};
