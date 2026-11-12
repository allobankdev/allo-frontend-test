import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getRocketById, getRockets } from "../rocketService";

const API_BASE_URL = "https://lldev.thespacedevs.com/2.2.0";

const mockRocket = {
  id: 123,
  full_name: "Falcon 9 Block 5",
  description: "Reusable two-stage rocket.",
  image_url: "https://example.com/falcon9.jpg",
  launch_cost: "52000000",
  maiden_flight: "2018-05-11",
  manufacturer: {
    country_code: "USA",
  },
};

function mockResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe("rocketService", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe("getRockets", () => {
    it("requests the correct SpaceX launcher endpoint", async () => {
      fetchMock.mockResolvedValue(
        mockResponse({
          results: [mockRocket],
          count: 1,
          next: null,
          previous: null,
        }),
      );

      await getRockets();

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`,
      );
    });

    it("maps API launcher data into Rocket format", async () => {
      fetchMock.mockResolvedValue(
        mockResponse({
          results: [mockRocket],
          count: 1,
          next: null,
          previous: null,
        }),
      );

      const rockets = await getRockets();

      expect(rockets).toEqual([
        {
          id: "123",
          name: "Falcon 9 Block 5",
          description: "Reusable two-stage rocket.",
          imageUrl: "https://example.com/falcon9.jpg",
          launchCost: "52000000",
          country: "USA",
          firstFlight: "2018-05-11",
        },
      ]);
    });

    it("handles missing optional API fields safely", async () => {
      fetchMock.mockResolvedValue(
        mockResponse({
          results: [
            {
              id: 456,
              full_name: "",
              description: null,
              image_url: null,
              launch_cost: null,
              maiden_flight: null,
              manufacturer: null,
            },
          ],
          count: 1,
          next: null,
          previous: null,
        }),
      );

      const rockets = await getRockets();

      expect(rockets[0]).toEqual({
        id: "456",
        name: "Unknown Rocket",
        description: "",
        imageUrl: null,
        launchCost: null,
        country: null,
        firstFlight: null,
      });
    });

    it("throws an error when the API request fails", async () => {
      fetchMock.mockResolvedValue(mockResponse({}, false, 500));

      await expect(getRockets()).rejects.toThrow(
        "Failed to fetch rockets (500)",
      );
    });
  });

  describe("getRocketById", () => {
    it("requests the correct launcher detail endpoint", async () => {
      fetchMock.mockResolvedValue(mockResponse(mockRocket));

      await getRocketById("123");

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/config/launcher/123/`,
      );
    });

    it("encodes the rocket ID in the request URL", async () => {
      fetchMock.mockResolvedValue(mockResponse(mockRocket));

      await getRocketById("id with space/");

      expect(fetchMock).toHaveBeenCalledWith(
        `${API_BASE_URL}/config/launcher/id%20with%20space%2F/`,
      );
    });

    it("maps the detail response into Rocket format", async () => {
      fetchMock.mockResolvedValue(mockResponse(mockRocket));

      const rocket = await getRocketById("123");

      expect(rocket).toEqual({
        id: "123",
        name: "Falcon 9 Block 5",
        description: "Reusable two-stage rocket.",
        imageUrl: "https://example.com/falcon9.jpg",
        launchCost: "52000000",
        country: "USA",
        firstFlight: "2018-05-11",
      });
    });

    it("throws an error when the detail request fails", async () => {
      fetchMock.mockResolvedValue(mockResponse({}, false, 404));

      await expect(getRocketById("999")).rejects.toThrow(
        "Failed to fetch rocket (404)",
      );
    });
  });
});
