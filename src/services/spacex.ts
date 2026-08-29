import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  getRockets() {
    return apiClient.get("/rockets");
  },
  getRocket(id: string) {
    return apiClient.get(`/rockets/${id}`);
  },
};
