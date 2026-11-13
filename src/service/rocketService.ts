import api from "@/api/api";
import { ENDPOINTS } from "@/api/endpoints";
import type { RocketListResponse, RocketResults } from "@/types/rocket";

const getRocketList = async (
  manufacturerName: string | null,
): Promise<RocketResults[]> => {
  const response = await api.get<RocketListResponse>(ENDPOINTS.ROCKET_LIST, {
    params: {
      manufacturer__name: manufacturerName,
      mode: "detailed",
      limit: 20,
    },
  });

  return response?.data?.results ?? [];
};

const getRocketDetail = async (id: number): Promise<RocketResults> => {
    const response = await api.get<RocketResults>(ENDPOINTS.ROCKET_DETAIL(id));

    return response?.data ?? null;
}

export const rocketService = {
  getRocketList,
  getRocketDetail
};
