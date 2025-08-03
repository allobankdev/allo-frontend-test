import apiInstance from "@/lib/api";
import type { ApiResponse, queryData } from "@/types/api.type";
import type { Crew } from "@/types/crew.type";

export const getCrewByFilter = async (
  name: string,
  agency: string,
  limit: number,
  page: number
): Promise<ApiResponse<Crew[]>> => {
  const query: queryData = {
    name: {
      $regex: name,
      $options: "i",
    },
  };

  if (agency && agency !== "All") {
    query.agency = agency;
  }

  const { data } = await apiInstance.post("/v4/crew/query", {
    query,
    options: {
      limit: limit,
      page: page,
    },
  });
  return data;
};

export const getCrewById = async (id: string) => {
  const response = await apiInstance.get<Crew>(`/v4/crew/${id}`);
  return { data: response.data };
};
