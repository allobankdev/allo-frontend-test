import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Rocket } from "@/types/rocket";

vi.mock("@/services/rocketService", () => ({
  getRockets: vi.fn(),
}));

function createRocket(overrides: Partial<Rocket> = {}): Rocket {
  return {
    id: "123",
    name: "Falcon 9 Block 5",
    description: "Reusable rocket developed by SpaceX",
    imageUrl: "https://example.com/falcon9.jpg",
    launchCost: "52000000",
    country: "USA",
    firstFlight: "2018-05-11",
    ...overrides,
  };
}

async function loadComposable() {
  vi.resetModules();

  const service = await import("@/services/rocketService");
  const composable = await import("../useRockets");

  return {
    useRockets: composable.useRockets,
    getRockets: vi.mocked(service.getRockets),
  };
}

describe("useRockets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("search", () => {
    it("returns all rockets when search is empty", async () => {
      const { useRockets } = await loadComposable();
      const store = useRockets();

      store.rockets.value = [
        createRocket(),
        createRocket({
          id: "456",
          name: "Starship",
          country: "USA",
        }),
      ];

      expect(store.filteredRockets.value).toHaveLength(2);
    });

    it("filters rockets by a single keyword", async () => {
      const { useRockets } = await loadComposable();
      const store = useRockets();

      store.rockets.value = [
        createRocket(),
        createRocket({
          id: "456",
          name: "Starship",
          description: "Fully reusable spacecraft",
        }),
      ];

      store.searchQuery.value = "falcon";

      expect(store.filteredRockets.value).toHaveLength(1);
      expect(store.filteredRockets.value[0].name).toBe("Falcon 9 Block 5");
    });

    it("requires all keywords to match", async () => {
      const { useRockets } = await loadComposable();
      const store = useRockets();

      store.rockets.value = [
        createRocket(),
        createRocket({
          id: "456",
          name: "Starship Prototype",
          description: "Experimental spacecraft",
          country: "USA",
        }),
      ];

      store.searchQuery.value = "falcon usa";

      expect(store.filteredRockets.value).toHaveLength(1);
      expect(store.filteredRockets.value[0].name).toBe("Falcon 9 Block 5");
    });

    it("ignores letter case and extra spaces", async () => {
      const { useRockets } = await loadComposable();
      const store = useRockets();

      store.rockets.value = [createRocket()];
      store.searchQuery.value = "  FALCON   BLOCK 5  ";

      expect(store.filteredRockets.value).toHaveLength(1);
    });
  });

  describe("custom rockets", () => {
    it("adds a custom rocket to the beginning of the list", async () => {
      const { useRockets } = await loadComposable();
      const store = useRockets();

      store.rockets.value = [createRocket()];

      vi.spyOn(Date, "now").mockReturnValue(123456789);

      store.addRocket({
        name: "Ziro Test Rocket",
        description: "Custom test rocket",
        imageUrl: null,
        launchCost: null,
        country: "Indonesia",
        firstFlight: null,
      });

      expect(store.rockets.value).toHaveLength(2);
      expect(store.rockets.value[0]).toMatchObject({
        id: "custom-123456789",
        name: "Ziro Test Rocket",
        isCustom: true,
      });
    });

    it("finds a rocket by its ID", async () => {
      const { useRockets } = await loadComposable();
      const store = useRockets();

      const rocket = createRocket();
      store.rockets.value = [rocket];

      expect(store.findRocketById("123")).toEqual(rocket);
      expect(store.findRocketById("999")).toBeUndefined();
    });
  });

  describe("fetchRockets", () => {
    it("loads rockets and updates loading state", async () => {
      const { useRockets, getRockets } = await loadComposable();
      const store = useRockets();

      const apiRockets = [createRocket()];
      getRockets.mockResolvedValue(apiRockets);

      const request = store.fetchRockets();

      expect(store.loading.value).toBe(true);
      expect(store.error.value).toBeNull();

      await request;

      expect(getRockets).toHaveBeenCalledOnce();
      expect(store.rockets.value).toEqual(apiRockets);
      expect(store.loading.value).toBe(false);
      expect(store.error.value).toBeNull();
    });

    it("preserves custom rockets when API data is loaded", async () => {
      const { useRockets, getRockets } = await loadComposable();
      const store = useRockets();

      const customRocket = createRocket({
        id: "custom-123",
        name: "Ziro Test Rocket",
        isCustom: true,
      });

      const apiRocket = createRocket();

      store.rockets.value = [customRocket];
      getRockets.mockResolvedValue([apiRocket]);

      await store.fetchRockets();

      expect(store.rockets.value).toEqual([customRocket, apiRocket]);
    });

    it("sets an error when the API request fails and allows retry", async () => {
      const { useRockets, getRockets } = await loadComposable();
      const store = useRockets();

      getRockets
        .mockRejectedValueOnce(new Error("Network unavailable"))
        .mockResolvedValueOnce([createRocket()]);

      await store.fetchRockets();

      expect(store.error.value).toBe("Network unavailable");
      expect(store.loading.value).toBe(false);

      await store.fetchRockets();

      expect(getRockets).toHaveBeenCalledTimes(2);
      expect(store.error.value).toBeNull();
      expect(store.rockets.value).toHaveLength(1);
    });

    it("prevents duplicate requests while a request is running", async () => {
      const { useRockets, getRockets } = await loadComposable();
      const store = useRockets();

      let resolveRequest!: (rockets: Rocket[]) => void;

      const pendingRequest = new Promise<Rocket[]>((resolve) => {
        resolveRequest = resolve;
      });

      getRockets.mockReturnValue(pendingRequest);

      const firstRequest = store.fetchRockets();
      const secondRequest = store.fetchRockets();

      expect(getRockets).toHaveBeenCalledOnce();
      expect(store.loading.value).toBe(true);

      resolveRequest([createRocket()]);

      await Promise.all([firstRequest, secondRequest]);

      expect(store.loading.value).toBe(false);
      expect(store.rockets.value).toHaveLength(1);
    });
  });
});
