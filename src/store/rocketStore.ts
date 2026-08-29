import { defineStore } from 'pinia'
import axios from 'axios'
import type { IRocket, IRocketList } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', {

  state: () => ({
    rockets: [] as IRocket[],
    status:  'loading' as'loading' | 'success' | 'error',
  }),

  getters: {
    totalRockets: (state) => state.rockets.length,
    rocketSummary:(state) : IRocketList[] => {
      return state.rockets.map(rocket => ({
        id: rocket.id,
        name: rocket.name,
        description: rocket.description,
        flickr_images: rocket.flickr_images[0]
      }))
    },
    detailedRocket: (state) => (id: string) => {
      return state.rockets.find(rocket => rocket.id === id)
    }
  },

  actions: {
    async fetchAllRockets() {

        if(this.rockets.length > 0) {
          return
        }
      this.status = 'loading'
      try {
        const response = await axios.get('https://api.spacexdata.com/v4/rockets')
        this.rockets = response.data
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        console.error('Error fetching SpaceX data:', error)
      }
    },

    
    addRocket(newRocket: IRocket) {
      this.rockets.unshift(newRocket) 
    }
  }
})