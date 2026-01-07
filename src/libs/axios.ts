import AxiosLib from "axios";

import { BASE_API_URL } from "@/helpers/constants";

const axios = AxiosLib.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here
    return Promise.reject(error);
  }
);

export default axios;
