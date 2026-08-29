import type { Rocket } from '@/types/rocket';

const BASE_URL = 'https://api.spacexdata.com/v4/rockets';

export const spacexService = {
    async getRockets(): Promise<Rocket[]> {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Error fetching rockets: ${response.statusText}`);
        }
        return response.json();
    },

    async getRocket(id: string): Promise<Rocket> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching rocket ${id}: ${response.statusText}`);
        }
        return response.json();
    }
};
