import axios from "axios";

const baseURL = import.meta.env.VITE_LEVEL === "dev" 
  ? import.meta.env.VITE_DEV_PUBLIC_API_URL 
  : import.meta.env.VITE_PROD_PUBLIC_API_URL


const instance = axios.create({
  baseURL,
  timeout: 30000,
});

export default instance;