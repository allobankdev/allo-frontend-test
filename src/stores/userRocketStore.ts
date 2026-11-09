import { defineStore } from 'pinia'

interface Rocket {
    fairings: string | null,
    links: {
        patch: {
            small: string | null,
            large: string | null
        },
        reddit: {
            campaign: string | null,
            launch: string | null,
            media: string | null,
            recovery: string | null,
        },
        flickr: {
            small: [],
            original: []
        },
        presskit: string | null,
        webcast: string | null,
        youtube_id: string | null,
        article: string | null,
        wikipedia: string | null,
    },
    static_fire_date_utc: Date,
    static_fire_date_unix: number,
    net: boolean | null,
    window: number,
    rocket: string | null,
    success: boolean | null,
    failures: [],
    details: string,
    crew: [],
    ships: [],
    capsules: [],
    payloads: [],
    launchpad: string | null,
    flight_number: number,
    name: string,
    date_utc: Date,
    date_unix: Date,
    date_local: Date,
    date_precision: string | null,
    upcoming: boolean | null,
    cores: [
        {
            core: string | null,
            flight: number,
            gridfins: boolean | null,
            legs: boolean | null,
            reused: boolean | null,
            landing_attempt: boolean | null,
            landing_success: boolean | null,
            landing_type: string | null,
            landpad: string | null
        }
    ],
    auto_update: boolean | null,
    tbd: boolean | null,
    launch_library_id: string | null,
    id: string | null
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    selectedRocket: null as Rocket | null,
    loading: false,
    error : false
  }),

  getters: {
    rocketCount: (state) => state.rockets.length,
  },

  actions: {
    async fetchRockets() {
      this.loading = true
      this.error = false
        try {
            const API_URL = 'https://api.spacexdata.com/v5/launches'
            const res = await fetch(API_URL)
            const data = await res.json()
            this.rockets = data
            console.log("Response Result :",this.rockets)
        } catch (err) {
            console.error(err)
            this.error = true
        } finally {
            this.loading = false
        }
    },

    selectRocket(id: string) {
      this.selectedRocket = this.rockets.find(r => r.id === id) || null
    }
  }
})
