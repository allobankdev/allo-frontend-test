import type { Rocket } from "@/types/rocket";

const BASE_URL = "https://api.spacexdata.com/v4";

async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status})${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

async function apiPost<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed (${res.status})${text ? `: ${text}` : ""}`);
  }
  return (await res.json()) as T;
}

function normalizeRocket(r: Rocket): Rocket {
  return {
    ...r,
    flickr_images: Array.isArray(r.flickr_images) ? r.flickr_images : [],
    source: r.source ?? "api",
  };
}

export type QueryBody<
  TQuery extends Record<string, unknown> = Record<string, unknown>,
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = {
  query?: TQuery;
  options?: TOptions;
};

export type PaginatedResult<T> = {
  docs: T[];
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
  offset?: number;
};

function coercePaginatedResult<T>(data: unknown): PaginatedResult<T> {
  if (Array.isArray(data)) return { docs: data as T[] };
  if (data && typeof data === "object" && "docs" in data) {
    const docs = (data as { docs?: unknown }).docs;
    if (Array.isArray(docs)) return data as PaginatedResult<T>;
  }
  throw new Error("Unexpected response shape from query endpoint");
}

export async function queryRockets(
  body: QueryBody = { query: {}, options: {} },
  signal?: AbortSignal
): Promise<PaginatedResult<Rocket>> {
  const data = await apiPost<unknown>("/rockets/query", body, signal);
  const result = coercePaginatedResult<Rocket>(data);
  return { ...result, docs: result.docs.map((r) => normalizeRocket(r)) };
}

export async function fetchRockets(signal?: AbortSignal): Promise<Rocket[]> {
  const res = await queryRockets(
    {
      query: {},
      options: {
        pagination: false,
        sort: { name: 1 },
      },
    },
    signal
  );
  return res.docs.map((r) => normalizeRocket({ ...r, source: "api" }));
}

export async function fetchRocketById(
  id: string,
  signal?: AbortSignal
): Promise<Rocket> {
  const data = await apiGet<Rocket>(`/rockets/${id}`, signal);
  return normalizeRocket({ ...data, source: "api" });
}
