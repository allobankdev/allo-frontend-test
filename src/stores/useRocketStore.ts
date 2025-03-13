import { defineStore } from "pinia";
import { ref,computed } from "vue";

import type { Rockets, Rocket } from "@/types/rocket";

export const useRocketStore = defineStore("rocketStore", () => {
  const rockets = ref<Rockets[]>(JSON.parse(localStorage.getItem("pinia-state-rocketStore") || "[]"));
  const rocket = ref<Rocket | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const isCreate = ref<boolean>(false);
  const searchTerm = ref<string>("");
  const newRocket = ref({
    name: "",
    description: "",
    flickr_images: [""],
    country: "",
    first_flight: "",
    cost_per_launch: "0",
    id: "",
    show: false,
  });

  const fetchRockets = async (): Promise<void> => {
    if (rockets.value.length > 0) return;
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch("https://api.spacexdata.com/v4/rockets");
      if (!response.ok) throw new Error("Failed to fetch rockets");
      rockets.value = await response.json();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const fetchRocketDetail = async (param: string | string[]) => {
    if(param.includes('local')) {
      rocket.value = rockets.value.filter(e=>e.id === param)[0]
      return
    }
    error.value = null;
    loading.value = true
    try {
      const response = await fetch(`https://api.spacexdata.com/v4/rockets/${param}`);
      if (!response.ok) throw new Error("Rocket not found");
      rocket.value = await response.json();
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  };

  const filteredRockets = computed(() => {
    return rockets.value.filter(rocket =>
      rocket.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });

  const createRocket = () => {
    if (!newRocket.value.name) return;
    
    const rocketToAdd = {
      ...newRocket.value,
      id: Date.now().toString()+'local',
    };

    rockets.value = [...rockets.value, rocketToAdd];
    localStorage.setItem("pinia-state-rocketStore", JSON.stringify({ rockets: rockets.value }));

    newRocket.value = {
      name: "",
      description: "",
      flickr_images: [""],
      country: "",
      first_flight: "",
      cost_per_launch: "0",
      id: "",
      show: false,
    };
    isCreate.value = false
  };

  const onImageUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      newRocket.value.flickr_images= [URL.createObjectURL(file)]
    }
  };


  return { rockets, rocket, error, loading,searchTerm, filteredRockets, newRocket, isCreate, fetchRockets, fetchRocketDetail, createRocket, onImageUpload };
}, {
  persist: {
    storage: localStorage, 
    pick: ["rockets", "rocket", "newRocket"], 
  },
});
