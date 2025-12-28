import axios from 'axios';

export const URL = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const getDatas = () => URL.get('/launches');
export const getDataById = (id: string) => URL.get(`/launches/${id}`);
