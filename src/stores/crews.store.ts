import { getCrewByFilter, getCrewById } from "@/api/crews.api";
import type { ApiResponse } from "@/types/api.type";
import type { Crew } from "@/types/crew.type";
import { defineStore } from "pinia";

export const useCrewsStore = defineStore("crews", {
  state: () => ({
    crews: [] as Crew[],
    crewDetail: {} as Crew,
  }),

  actions: {
    async getCrews(
      name: string,
      agency: string,
      limit: number,
      page: number
    ): Promise<ApiResponse<Crew[]>> {
      const response = await getCrewByFilter(name, agency, limit, page);
      this.crews = response.docs;
      return response;
    },
    async getCrewById(id: string): Promise<{ data: Crew }> {
      const response = await getCrewById(id);
      this.crewDetail = response.data;
      return response;
    },
  },
});
