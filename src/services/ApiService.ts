import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

const AxiosService = axios.create({
  baseURL: import.meta.env.VITE_APP_API_HOST || "https://api.spacexdata.com/v4",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const ApiService = async <T>(param: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await AxiosService(param);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("API Error:", axiosError);
    throw axiosError;
  }
};