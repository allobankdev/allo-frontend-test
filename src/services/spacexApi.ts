import axios from "axios";

const api = axios.create({
  baseURL: "https://api.spacexdata.com/v4",
});

export const getRockets = () =>
  api.get("/rockets").then((res) => res.data);

export const getRocketById = (id: string) =>
  api.get(`/rockets/${id}`).then((res) => res.data);
