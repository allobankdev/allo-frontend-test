import axios from "axios";

const BASE_URL = "https://api.spacexdata.com/latest";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
