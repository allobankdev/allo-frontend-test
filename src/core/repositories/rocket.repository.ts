import type { RocketEntity } from "../entities/rocket.entity";

export interface QueryOptions {
  query?: Record<string, any>;
  options?: {
    select?: string[];
    sort?: Record<string, number>;
    limit?: number;
    page?: number;
    offset?: number;
  };
}

export interface QueryResponse<T> {
  docs: T[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

export interface RocketRepository {
  fetchAll(queryOptions: QueryOptions): Promise<QueryResponse<RocketEntity>>;
  fetchOne(rocketId: string): Promise<RocketEntity>;
}
