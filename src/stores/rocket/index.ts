import { defineStore } from 'pinia'
import axios from 'axios'
import type { defaultRocket } from '@/types/rocket'
export const useRocketStore = defineStore('rocket', {
  state: () => {
    return {
      loading: false as boolean,
      dataDetail: null as defaultRocket | null,
      allData: [] as defaultRocket[],
      data: [] as defaultRocket[],  
      filteredData: [] as defaultRocket[],
      page: 1,
      limit: 4,
      search: '',
      alertStatus: false as boolean
    }
  },
  actions: {
    async getRocket() {
      this.loading = true
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/rockets`)

        if(this.allData.length > 0){
          for(let i=0; i<response.data.length; i++){
            if(!this.allData.find((rocket: any) => rocket.id === response.data[i].id)){
              this.allData.unshift({
                id: response.data[i].id,
                name: response.data[i].name,
                description: response.data[i].description,
                flickr_images: response.data[i].flickr_images,
                cost_per_launch: response.data[i].cost_per_launch,
                country: response.data[i].country,
                first_flight: response.data[i].first_flight
              })
            }
          }
        }else{
          this.allData = response.data.map((rocket: any) => ({
            id: rocket.id,
            name: rocket.name,
            description: rocket.description,
            flickr_images: rocket.flickr_images,
            cost_per_launch: rocket.cost_per_launch,
            country: rocket.country,
            first_flight: rocket.first_flight
          }))
        }


        this.filteredData = [...this.allData]
        this.page = 1
        this.data = this.filteredData.slice(0, this.limit)
        
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('getRocket error => ', error)
      }
    },
    getRocketById(id: string) {
      this.loading = true
      try {
        const response = this.allData.find((rocket: any) => rocket.id === id)
        if(response !== undefined){
          this.dataDetail = {
            id: response.id,
            name: response.name,
            description: response.description,
            flickr_images: response.flickr_images,
            cost_per_launch: response.cost_per_launch,
            country: response.country,
            first_flight: response.first_flight,
          }
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        console.error('getRocketById error => ', error)
      }
    },
    applySearch(keyword: string) {
      this.search = keyword.toLowerCase()
      this.page = 1

      if (!this.search) {
        this.filteredData = [...this.allData]
      } else {
        this.filteredData = this.allData.filter((rocket) =>
          rocket.name.toLowerCase().includes(this.search) ||
          rocket.description.toLowerCase().includes(this.search)
        )
      }

      this.data = this.filteredData.slice(0, this.limit)
    },
    loadMore() {
      const start = this.page * this.limit
      const end = start + this.limit
      const next = this.filteredData.slice(start, end)

      if (next.length) {
        this.data.push(...next)
        this.page++
        return true
      }
      return false
    },
    addRocket(rocket: defaultRocket) {
      this.allData.push(rocket)
      this.filteredData.push(rocket)
      this.data.push(rocket)
    },
    showAlert(){
      this.alertStatus = true
    },
    
  },
})