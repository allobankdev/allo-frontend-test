import { defineStore } from "pinia";
import axios from "axios";

export const useRocket = defineStore("rocket", {
  state: () => ({
    tempRockets: [],
    rockets: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRockets() {
      if (this.rockets.length || this.tempRockets.length) {
        this.rockets = this.tempRockets;
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("https://api.spacexdata.com/v4/rockets");
        this.rockets = res.data;
        this.tempRockets = res.data;
      } catch (err) {
        this.error = "Failed to fetch rockets";
      } finally {
        this.loading = false;
      }
    },
    async fetchRocketsById(id) {
      const exists = this.rockets.find(r => r.id === id);
      if (exists) {
        this.rockets = [exists];
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get(
          `https://api.spacexdata.com/v4/rockets/${id}`,
        );
        this.rockets = [res.data];
      } catch (err) {
        this.error = "Failed to fetch rockets";
      } finally {
        this.loading = false;
      }
    },
    setFilterName(filter) {
        if (!filter) {
            this.fetchRockets()
        } else {
            this.rockets = this.tempRockets.filter((rocket) =>
                rocket.name.toLowerCase().includes(filter.toLowerCase())
            )
        }
    },
    addRocket(newRocket) {
        this.rockets.push(newRocket)
    },
  },
});
