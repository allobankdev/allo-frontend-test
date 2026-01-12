import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const BASE_URL = "https://api.spacexdata.com/v4";

const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: <T>(url: string, config?: object) =>
    http.get<T>(url, config).then((res) => res.data),
};
