import axios from "axios";

const api = axios.create({
  baseURL: "https://api.spacexdata.com",
  timeout: 10000,
});

const getRockets = async () => {
  return await api.get(`/v5/launches/latest`);
};

export default {
  getRockets,
};
