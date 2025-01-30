<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 50px;">
    <div v-if="rocket">
      <h1 style="text-align: center; margin-bottom: 30px;">{{ rocket.name }}</h1>
      <img class="centered-image" style="margin-bottom: 30px;" :src="rocket.flickr_images[0]" alt="Rocket Image" />
      <p style="max-width: 800px; text-align: center; margin-bottom: 30px;">{{ rocket.description }}</p>
      <ul style="list-style: none; padding: 0; margin-bottom: 30px;">
        <li><strong>Cost per Launch:</strong> ${{ rocket.cost_per_launch }}</li>
        <li><strong>Country:</strong> {{ rocket.country }}</li>
        <li><strong>First Flight:</strong> {{ rocket.first_flight }}</li>
      </ul>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 30px;">
        <!-- First Stage -->
        <div>
          <h3>First Stage</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Thrust (Sea Level):</strong> {{ rocket.first_stage.thrust_sea_level.lbf }} lbf</li>
            <li><strong>Burn Time:</strong> {{ rocket.first_stage.burn_time_sec }} seconds</li>
            <li><strong>Fuel Amount:</strong> {{ rocket.first_stage.fuel_amount_tons }} tons</li>
          </ul>
        </div>

        <!-- Second Stage -->
        <div>
          <h3>Second Stage</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Thrust:</strong> {{ rocket.second_stage.thrust.lbf }} lbf</li>
            <li><strong>Fuel Amount:</strong> {{ rocket.second_stage.fuel_amount_tons }} tons</li>
            <li><strong>Burn Time:</strong> {{ rocket.second_stage.burn_time_sec }} seconds</li>
          </ul>
        </div>

        <!-- Engines -->
        <div>
          <h3>Engines</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Number of Engines:</strong> {{ rocket.engines?.number }}</li>
            <li><strong>Engine Type:</strong> {{ rocket.engines?.type }}</li>
            <li><strong>Thrust (Vacuum):</strong> {{ rocket.engines?.thrust_vacuum.lbf }} lbf</li>
            <li><strong>ISP (Vacuum):</strong> {{ rocket.engines?.isp.vacuum }} s</li>
          </ul>
        </div>
      </div>

      <h3 style="margin-bottom: 20px;">Payload Weights</h3>
      <ul style="list-style: none; padding: 0;">
        <li v-for="payload in rocket.payload_weights" :key="payload.id">
          <strong>{{ payload.name }}:</strong> {{ payload.kg }} kg ({{ payload.lb }} lb)
        </li>
      </ul>
    </div>

    <div v-else>
      <p>Loading rocket data...</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Define the type for the rocket
interface Rocket {
  id: string
  name: string
  description: string
  flickr_images: string[]
  cost_per_launch: number
  country: string
  first_flight: string
  first_stage: {
    thrust_sea_level: {
      lbf: number
    }
    burn_time_sec: number
    fuel_amount_tons: number
  }
  second_stage: {
    thrust: {
      lbf: number
    }
    fuel_amount_tons: number
    burn_time_sec: number
  }
  engines?: {
    number: number
    type: string
    thrust_vacuum: {
      lbf: number
    }
    isp: {
      vacuum: number
    }
  }
  payload_weights: {
    id: string
    name: string
    kg: number
    lb: number
  }[]
}

// This will be used to store the rocket data fetched based on the ID
const route = useRoute()
const rocket = ref<Rocket | null>(null)

onMounted(() => {
  const rocketId = route.params.id

  const rocketsFromLocalStorage = JSON.parse(localStorage.getItem('rockets') || '[]')

  console.log('Rockets from localStorage:', rocketsFromLocalStorage)

  rocket.value = rocketsFromLocalStorage.find((r: Rocket) => r.id === rocketId)

  if (!rocket.value) {
    console.error('Rocket not found in localStorage')
  }
})
</script>


  <style scoped>
  .centered-image {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    margin-bottom: 30px; 
  }
  </style>
