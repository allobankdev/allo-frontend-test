import type { RocketDetail, RocketResponse } from "@/types/rocket";

export class SpaceXApiService {
  private static baseUrl = import.meta.env.VITE_API_BASE_URL;
  private static async request<T>(endpoint: string): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getRockets(): Promise<RocketResponse[]> {
    return this.request<RocketResponse[]>("/rockets");
  }

  static async getRocket(id: string): Promise<RocketDetail> {
    return this.request<RocketDetail>(`/rockets/${id}`);
  }
}
