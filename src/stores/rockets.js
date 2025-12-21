import { ref } from "vue";
import { defineStore } from 'pinia'
import { getListRockets } from "@/service/spaceX.js";

export const rocketStore = defineStore('rocketStore', () => {
  const listRockets = ref([])

  function addRocket(rocket) {
    listRockets.value = [...listRockets.value, rocket]
  }

  function removeRocket(id) {
    listRockets.value = listRockets.value.filter(rocket => rocket.id !== id)
  }

  function getRocket(id) {
    return listRockets.value.find(rocket => rocket.id === id)
  }

  async function fetchRockets() {
    await getListRockets()
      .then(function (response) {
        listRockets.value = response
      })
      .catch(function (error) {
        console.log("Fetch Rockets Error : ", error)
        // alert("Fetch Rockets Error : " + error)
      })
  }

  return {
    listRockets, addRocket, removeRocket, getRocket, fetchRockets
  }
}, { persist: true })
