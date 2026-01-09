import { computed, reactive } from "vue";
import type { NewRocketInput, Rocket } from "@/types/rocket";
import { fetchRocketById, fetchRockets, queryRockets } from "@/services/spacex";

type FetchStatus = "idle" | "loading" | "success" | "error";

const LOCAL_ROCKETS_STORAGE_KEY = "allo:local-rockets:v4";

const state = reactive({
  rockets: [] as Rocket[],
  listStatus: "idle" as FetchStatus,
  listError: null as string | null,
  listAppendStatus: "idle" as FetchStatus,
  listAppendError: null as string | null,
  listPage: 1,
  listLimit: 9,
  listHasNextPage: false,
  listNextPage: null as number | null,
  listTotalDocs: null as number | null,
  listQueryKey: "" as string,
  detailStatusById: {} as Record<string, FetchStatus>,
  detailErrorById: {} as Record<string, string | null>,
});

type LoadOptions = {
  force?: boolean;
  signal?: AbortSignal;
};

function upsertRocket(rocket: Rocket, place: "start" | "end" = "end") {
  const idx = state.rockets.findIndex((r) => r.id === rocket.id);
  if (idx >= 0) state.rockets[idx] = rocket;
  else if (place === "start") state.rockets.unshift(rocket);
  else state.rockets.push(rocket);
}

type PersistedLocalRocket = Pick<
  Rocket,
  | "id"
  | "name"
  | "description"
  | "flickr_images"
  | "cost_per_launch"
  | "country"
  | "first_flight"
  | "active"
>;

function persistLocalRockets() {
  if (typeof localStorage === "undefined") return;
  try {
    const locals = getLocalRockets().map<PersistedLocalRocket>((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      flickr_images: Array.isArray(r.flickr_images) ? r.flickr_images : [],
      cost_per_launch: r.cost_per_launch,
      country: r.country,
      first_flight: r.first_flight,
      active: r.active,
    }));
    localStorage.setItem(LOCAL_ROCKETS_STORAGE_KEY, JSON.stringify(locals));
  } catch {
    // ignore storage failures (quota, privacy mode, etc)
  }
}

function hydrateLocalRockets() {
  if (typeof localStorage === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_ROCKETS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return;

    const locals: Rocket[] = parsed
      .filter((x) => x && typeof x === "object")
      .map((x) => x as Partial<PersistedLocalRocket>)
      .filter(
        (r) =>
          typeof r.id === "string" &&
          typeof r.name === "string" &&
          typeof r.description === "string" &&
          typeof r.cost_per_launch === "number" &&
          typeof r.country === "string" &&
          typeof r.first_flight === "string"
      )
      .map<Rocket>((r) => ({
        id: r.id as string,
        name: (r.name as string).trim(),
        description: (r.description as string).trim(),
        flickr_images: Array.isArray(r.flickr_images)
          ? (r.flickr_images as string[]).filter(Boolean)
          : [],
        cost_per_launch: r.cost_per_launch as number,
        country: (r.country as string).trim(),
        first_flight: r.first_flight as string,
        active: typeof r.active === "boolean" ? r.active : true,
        source: "local",
      }));

    if (locals.length === 0) return;
    const nonLocals = state.rockets.filter((r) => r.source !== "local");
    state.rockets = [...locals, ...nonLocals];
  } catch {
    // ignore corrupt JSON
  }
}

async function loadAll(options: LoadOptions = {}) {
  if (state.listStatus === "loading") return;
  if (
    !options.force &&
    state.listStatus === "success" &&
    state.rockets.length > 0
  )
    return;
  state.listStatus = "loading";
  state.listError = null;
  try {
    const data = await fetchRockets(options.signal);
    const locals = getLocalRockets();
    state.rockets = [...locals, ...data];
    state.listStatus = "success";
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      state.listStatus = "idle";
      return;
    }
    state.listStatus = "error";
    state.listError = e instanceof Error ? e.message : "Unknown error";
  }
}

async function loadById(id: string, options: LoadOptions = {}) {
  if (!id) return;
  const cached = state.rockets.find((r) => r.id === id);
  if (!options.force && cached?.source === "local") return;
  if (!options.force && state.detailStatusById[id] === "success" && cached)
    return;
  if (state.detailStatusById[id] === "loading") return;
  state.detailStatusById[id] = "loading";
  state.detailErrorById[id] = null;
  try {
    const rocket = await fetchRocketById(id, options.signal);
    upsertRocket(rocket, "end");
    state.detailStatusById[id] = "success";
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      state.detailStatusById[id] = "idle";
      return;
    }
    state.detailStatusById[id] = "error";
    state.detailErrorById[id] =
      e instanceof Error ? e.message : "Unknown error";
  }
}

type RocketsListFilters = {
  search?: string;
  active?: "all" | "active" | "inactive";
};

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildRocketsQuery(filters: RocketsListFilters = {}) {
  const and: Record<string, unknown>[] = [];

  if (filters.active === "active") and.push({ active: true });
  if (filters.active === "inactive") and.push({ active: false });

  const q = (filters.search ?? "").trim();
  if (q) {
    const rx = escapeRegExp(q);
    and.push({
      $or: [
        { name: { $regex: rx, $options: "i" } },
        { description: { $regex: rx, $options: "i" } },
        { country: { $regex: rx, $options: "i" } },
      ],
    });
  }

  if (and.length === 0) return {};
  if (and.length === 1) return and[0];
  return { $and: and };
}

function getLocalRockets() {
  return state.rockets.filter((r) => r.source === "local");
}

function setListMetaFromResponse(res: {
  page?: number;
  hasNextPage?: boolean;
  nextPage?: number | null;
  totalDocs?: number;
}) {
  if (typeof res.page === "number") state.listPage = res.page;
  state.listHasNextPage = Boolean(res.hasNextPage);
  state.listNextPage =
    typeof res.nextPage === "number" ? res.nextPage : res.nextPage ?? null;
  state.listTotalDocs =
    typeof res.totalDocs === "number" ? res.totalDocs : null;
}

async function loadFirstPage(
  filters: RocketsListFilters = {},
  options: LoadOptions = {}
) {
  if (state.listStatus === "loading") return;

  const query = buildRocketsQuery(filters);
  const queryKey = JSON.stringify({ query, limit: state.listLimit });

  if (
    !options.force &&
    state.listStatus === "success" &&
    state.listQueryKey === queryKey
  )
    return;

  state.listQueryKey = queryKey;
  state.listStatus = "loading";
  state.listError = null;
  state.listAppendStatus = "idle";
  state.listAppendError = null;

  try {
    const res = await queryRockets(
      {
        query,
        options: {
          page: 1,
          limit: state.listLimit,
          sort: { name: 1 },
        },
      },
      options.signal
    );

    const locals = getLocalRockets();
    state.rockets = [...locals, ...res.docs];
    state.listStatus = "success";
    setListMetaFromResponse(res);
    state.listPage = 1;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      state.listStatus = "idle";
      return;
    }
    state.listStatus = "error";
    state.listError = e instanceof Error ? e.message : "Unknown error";
  }
}

async function loadNextPage(options: LoadOptions = {}) {
  if (state.listStatus !== "success") return;
  if (state.listAppendStatus === "loading") return;
  if (!state.listHasNextPage) return;

  const parsed = (() => {
    try {
      return JSON.parse(state.listQueryKey || "{}") as {
        query?: Record<string, unknown>;
      };
    } catch {
      return { query: {} };
    }
  })();

  const next = state.listNextPage ?? state.listPage + 1;
  state.listAppendStatus = "loading";
  state.listAppendError = null;

  try {
    const res = await queryRockets(
      {
        query: parsed.query ?? {},
        options: {
          page: next,
          limit: state.listLimit,
          sort: { name: 1 },
        },
      },
      options.signal
    );

    const existingIds = new Set(state.rockets.map((r) => r.id));
    const toAdd = res.docs.filter((r) => !existingIds.has(r.id));
    state.rockets.push(...toAdd);
    state.listAppendStatus = "success";
    setListMetaFromResponse(res);
    if (typeof res.page === "number") state.listPage = res.page;
    else state.listPage = next;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      state.listAppendStatus = "idle";
      return;
    }
    state.listAppendStatus = "error";
    state.listAppendError = e instanceof Error ? e.message : "Unknown error";
  }
}

function addRocket(input: NewRocketInput) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `local-${crypto.randomUUID()}`
      : `local-${Date.now()}`;
  const rocket: Rocket = {
    id,
    name: input.name.trim(),
    description: input.description.trim(),
    flickr_images: input.imageUrl ? [input.imageUrl] : [],
    cost_per_launch: input.cost_per_launch,
    country: input.country.trim(),
    first_flight: input.first_flight,
    active: input.active ?? true,
    source: "local",
  };
  upsertRocket(rocket, "start");
  persistLocalRockets();
  return rocket;
}

function getById(id: string): Rocket | undefined {
  return state.rockets.find((r) => r.id === id);
}

export function useRocketsStore() {
  return {
    rockets: computed(() => state.rockets),
    listStatus: computed(() => state.listStatus),
    listError: computed(() => state.listError),
    listAppendStatus: computed(() => state.listAppendStatus),
    listAppendError: computed(() => state.listAppendError),
    listHasNextPage: computed(() => state.listHasNextPage),
    getDetailStatus: (id: string) => state.detailStatusById[id] ?? "idle",
    getDetailError: (id: string) => state.detailErrorById[id] ?? null,
    loadAll,
    loadFirstPage,
    loadNextPage,
    loadById,
    addRocket,
    getById,
  };
}

// hydrate local rockets once on module load
hydrateLocalRockets();
