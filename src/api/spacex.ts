import axios from 'axios';
import type { Rocket } from '../types';

const API_BASE = 'https://api.spacexdata.com/v4';

export const spacexAPI = {
  // Get all rockets
  async getRockets(): Promise<Rocket[]> {
    try {
      const response = await axios.get<Rocket[]>(`${API_BASE}/rockets`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rockets:', error);
      throw error;
    }
  },

  // Get single rocket by ID
  async getRocketById(id: string): Promise<Rocket> {
    try {
      const response = await axios.get<Rocket>(`${API_BASE}/rockets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rocket ${id}:`, error);
      throw error;
    }
  }
};