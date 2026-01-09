import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api.example.com/";

export const api = axios.create({
  baseURL: baseUrl,
});

export const getListRockets = `${baseUrl}v4/rockets`;
