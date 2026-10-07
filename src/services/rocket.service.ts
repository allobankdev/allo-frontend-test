import { fetchApi } from './api';
import type { Rocket, RocketListResponse } from '../types/rocket';

export const RocketService = {
  /**
   * Fetch a list of SpaceX rockets
   */
  async getRockets(): Promise<RocketListResponse> {
    return fetchApi<RocketListResponse>('/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20');
  },

  /**
   * Fetch detail of a single rocket by ID
   * @param id Rocket ID
   */
  async getRocketById(id: string | number): Promise<Rocket> {
    return fetchApi<Rocket>(`/config/launcher/${id}/`);
  }
};
