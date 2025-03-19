import type { Rocket } from "@/types/Rocket";
import axios from "axios";
import { defineStore } from "pinia";

export const useRocketStore = defineStore('rocketStore',{
  state: () =>({
    rockets: [] as Rocket[],
    isLoading: false,
    isSuccess: false,
    isError: false,
  }),
  actions:{
    async getRockets(){
      this.isLoading = true
      try{
        const response = await axios.get("https://api.spacexdata.com/v5/launches")
        this.rockets = response.data;
      }catch(error){
        console.error("Failed to fetch rockets:",error)
        this.isError = true
        console.log("isError updated to:", this.isError);
      } finally{
        this.isLoading = false
      }
    },

    addRocket(rocket: Rocket){
      this.rockets.push(rocket);
      this.isSuccess = true;
    }
  },
  getters:{
    getRocketsByName: (state) => (name: string) =>{
      return state.rockets.filter((rocket) => rocket.name === name);
    },
    getRocketNames: (state) => {
     const uniqueNames = new Set(state.rockets.map((rocket) => rocket.name));
    return Array.from(uniqueNames)
      // return state.rockets.map((rocket) => rocket.name)
    }
  }

});
