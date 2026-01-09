import axios from 'axios'

const API_BASE_URL = 'https://api.spacexdata.com/v4'

const spacexApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const rocketApi = {
  /**
   * Fetch all rockets from SpaceX API
   * @returns {Promise<Array>} List of rockets
   */
  async getAllRockets() {
    try {
      const response = await spacexApi.get('/rockets')
      return response.data
    } catch (error) {
      console.error('Error fetching rockets:', error)
      throw new Error('Failed to fetch rockets. Please try again later.')
    }
  },

  /**
   * Fetch a single rocket by ID
   * @param {string} id - Rocket ID
   * @returns {Promise<Object>} Rocket data
   */
  async getRocketById(id) {
    try {
      const response = await spacexApi.get(`/rockets/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching rocket:', error)
      throw new Error('Failed to fetch rocket details. Please try again later.')
    }
  }
}

export default spacexApi
