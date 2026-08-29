import axios, { AxiosInstance, AxiosError } from "axios";
import type { Rocket, CreateRocketDto } from "../types/rocket";

class RocketService {
  private api: AxiosInstance;
  private readonly API_BASE_URL = "https://api.spacexdata.com/v4";
  private readonly TIMEOUT = 10000; // 10 seconds
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.api = axios.create({
      baseURL: this.API_BASE_URL,
      timeout: this.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for logging/retry
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  // Get all rockets with retry logic
  async getRockets(): Promise<Rocket[]> {
    try {
      const response = await this.withRetry(() =>
        this.api.get<Rocket[]>("/rockets")
      );
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  // Get rocket by ID
  async getRocketById(id: string): Promise<Rocket> {
    try {
      const response = await this.withRetry(() =>
        this.api.get<Rocket>(`/rockets/${id}`)
      );
      return response.data;
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  async createRocket(rocketData: CreateRocketDto): Promise<Rocket> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Pastikan flickr_images ada
    const flickr_images = rocketData.flickr_images || [];

    // Create COMPLETE mock rocket dengan SEMUA properti yang dibutuhkan
    const mockRocket: Rocket = {
      id: `custom-${Date.now()}`,
      rocket_id: rocketData.rocket_name.toLowerCase().replace(/\s+/g, "-"),
      rocket_name: rocketData.rocket_name,
      rocket_type: rocketData.rocket_type,
      active: rocketData.active,
      country: rocketData.country,
      company: rocketData.company || "SpaceX",
      cost_per_launch: rocketData.cost_per_launch,
      success_rate_pct:
        rocketData.success_rate_pct || Math.floor(Math.random() * 100),
      first_flight: rocketData.first_flight,
      height: { meters: 70, feet: 229.6 },
      diameter: { meters: 3.7, feet: 12 },
      mass: { kg: 549054, lb: 1207920 },
      flickr_images:
        flickr_images.length > 0
          ? flickr_images
          : [
              "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600",
            ],
      description: rocketData.description,
      wikipedia: rocketData.wikipedia || "https://en.wikipedia.org/wiki/SpaceX",

      // ENGINE PROPERTIES (yang missing)
      engines: {
        number: 9,
        type: "merlin",
        version: "1D+",
        layout: "octaweb",
        isp: { sea_level: 288, vacuum: 312 },
        engine_loss_max: 2,
        propellant_1: "liquid oxygen",
        propellant_2: "RP-1 kerosene",
        thrust_sea_level: { kN: 845, lbf: 190000 },
        thrust_vacuum: { kN: 914, lbf: 205500 },
        thrust_to_weight: 180,
      },

      // LANDING LEGS
      landing_legs: {
        number: 4,
        material: "carbon fiber",
      },

      // PAYLOAD WEIGHTS
      payload_weights: [
        { id: "leo", name: "LEO", kg: 22800, lb: 50265 },
        { id: "gto", name: "GTO", kg: 8300, lb: 18300 },
      ],

      // STAGES & BOOSTERS
      stages: 2,
      boosters: 0,

      // FIRST STAGE
      first_stage: {
        reusable: true,
        engines: 9,
        fuel_amount_tons: 287,
        burn_time_sec: 162,
        thrust_sea_level: { kN: 7607, lbf: 1710000 },
        thrust_vacuum: { kN: 8227, lbf: 1850000 },
      },

      // SECOND STAGE
      second_stage: {
        reusable: false,
        engines: 1,
        fuel_amount_tons: 90,
        burn_time_sec: 397,
        thrust: { kN: 934, lbf: 210000 },
        payloads: {
          option_1: "dragon",
          composite_fairing: {
            height: { meters: 13.1, feet: 43 },
            diameter: { meters: 5.2, feet: 17.1 },
          },
        },
      },
    };

    return mockRocket;
  }

  // Private helper methods
  private async withRetry<T>(
    fn: () => Promise<T>,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        // Exponential backoff
        const delay = Math.pow(2, this.MAX_RETRIES - retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    );
  }

  private normalizeError(error: any): Error {
    if (error instanceof AxiosError) {
      if (error.code === "ECONNABORTED") {
        return new Error("Request timeout. Please try again.");
      }
      if (error.code === "NETWORK_ERROR") {
        return new Error("Network error. Please check your connection.");
      }
      return new Error(error.message || "API request failed");
    }
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }

  private handleError(error: AxiosError): Promise<never> {
    // Custom error handling logic
    console.error("API Error:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
}

// Export singleton instance
export const rocketService = new RocketService();
