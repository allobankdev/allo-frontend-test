import axios from "axios";

export const spacexApi = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
});

export const getRockets = () => spacexApi.get("/rockets");
export const getRocketById = (id: string) => spacexApi.get(`/rockets/${id}`);
