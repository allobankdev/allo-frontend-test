import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useRocketStore } from "@/stores/rocketStore";
import axios from "axios";

vi.mock("axios");

describe("Rocket Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("initializes with empty rockets", () => {
    const store = useRocketStore();
    expect(store.rockets.length).toBe(0);
  });

  it("fetches rockets successfully", async () => {
    const store = useRocketStore();

    const mockRockets = [
      {
        id: "1",
        name: "Falcon 1",
        description: "Small rocket",
        flickr_images: [],
        cost_per_launch: 10,
        country: "USA",
        first_flight: "2006-01-01",
      },
    ];

    vi.mocked(axios.get).mockResolvedValue({ data: mockRockets });

    await store.loadData();

    expect(store.rockets.length).toBe(1);
    expect(store.rockets[0].name).toBe("Falcon 1");
    expect(store.loading).toBe(false);
  });

  it("adds a rocket manually", () => {
    const store = useRocketStore();

    const newRocket = {
      id: "999",
      name: "Test Rocket",
      description: "Unit test rocket",
      flickr_images: [],
      cost_per_launch: 100,
      country: "Testland",
      first_flight: "2025-01-01",
    };

    store.addRocket(newRocket);

    expect(store.rockets.length).toBe(1);
    expect(store.rockets[0].id).toBe("999");
  });
});
