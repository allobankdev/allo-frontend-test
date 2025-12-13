import axios, { type AxiosInstance } from "axios";
import type { RocketEntity } from "@/core/entities/rocket.entity";
import {
  type QueryOptions,
  type QueryResponse,
  type RocketRepository,
} from "@/core/repositories/rocket.repository";
import type { RocketDtoSpaceX } from "./rocket.dto.spacex";
import { RocketMapper } from "./rocket.mapper.spacex";

export class RocketRepositorySpaceX implements RocketRepository {
  private readonly axios: AxiosInstance;
  private readonly mapper: RocketMapper;

  constructor() {
    this.axios = axios.create({
      baseURL: import.meta.env.VITE_SPACEX_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.mapper = new RocketMapper();
  }

  async fetchAll(
    queryOptions: QueryOptions
  ): Promise<QueryResponse<RocketEntity>> {
    try {
      const { data } = await this.axios.post<QueryResponse<RocketDtoSpaceX>>(
        "/rockets/query",
        queryOptions
      );

      return {
        ...data,
        docs: data.docs.map((dto) => this.mapper.toEntity(dto)),
      };
    } catch (error) {
      console.error("Error querying rockets:", error);
      throw error;
    }
  }

  async fetchOne(rocketId: string): Promise<RocketEntity> {
    try {
      const { data } = await this.axios.get<RocketDtoSpaceX>(
        `/rockets/${rocketId}`
      );

      return this.mapper.toEntity(data);
    } catch (error) {
      console.error(`Error fetching rocket ${rocketId}:`, error);
      throw error;
    }
  }
}
