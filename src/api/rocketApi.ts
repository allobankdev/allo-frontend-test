import { api } from "./axios";
import type { Rocket } from '../types/rocket'

export const fetchRockets = async (): Promise<Rocket[]> => {
    const response = await api.get<Rocket[]>("/rockets");
    return response.data;
};