import axios from "axios";

const api = axios.create({
  baseURL: "https://github.com/r-spacex/SpaceX-API"
});

export const fetchRockets = async () => {
  const response = await api.get("/rockets");
  return response.data;
};