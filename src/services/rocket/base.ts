import axios from "axios";

const API_BASE = "https://api.spacexdata.com/v4/rockets";

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    // Bisa ditambah: map error, report ke monitoring, dll.
    // Normalisasi error agar return konsisten
    const err = error?.response
      ? {
          status: error.response.status,
          data: error.response.data,
          message: error.message,
        }
      : {
          status: null,
          data: null,
          message: error?.message ?? "Network/Unknown error",
        };
    return Promise.reject(err);
  }
);
