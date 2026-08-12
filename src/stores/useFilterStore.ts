import {defineStore} from 'pinia'

export const useFilterStore = defineStore('filter', {
  state: () => ({
    search: '',
    country: null as string | null,
  }),
  actions: {
    setSearch(search: string) {
      this.search = search
    },
    setCountry(country: string) {
      this.country = country
    },
  },
})
