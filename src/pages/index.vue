<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6">
    <h1 class="text-h3">
      Rocket List
    </h1>

    <v-btn
      prepend-icon="mdi-plus"
      color="primary"
      @click="showAddForm = !showAddForm"
    >
      Add Rocket
    </v-btn>
  </div>

  <AddRocketForm
    v-if="showAddForm"
    @add="addRocket"
  />

    <v-text-field
      v-model="search"
      label="Search rockets"
      placeholder="e.g. Falcon"
      prepend-inner-icon="mdi-magnify"
      clearable
      class="mb-6"
    />

    <div
    v-if="loading"
    class="d-flex justify-center align-center"
    style="min-height: 300px;"
  >
    <v-progress-circular
      indeterminate
      size="64"
      width="6"
    />
  </div>

    <div v-else-if="error">
      <p>Failed to load rockets.</p>

      <v-btn @click="fetchRockets">
        Retry
      </v-btn>
    </div>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import type { Rocket } from "@/types/rocket"

// type Rocket = {
//   id: number
//   full_name: string
//   description: string | null
//   image_url: string | null
//   launch_cost: number | null
//   maiden_flight: string | null
//   manufacturer?: {
//     country_code?: string | null
//   }
// }

const rockets = ref<Rocket[]>([])
const loading = ref(true)
const error = ref(false)

const search = ref("")
const showAddForm = ref(false)

function addRocket(newRocket: {
  name: string
  description: string
}) {
  rockets.value.push({
    id: Date.now(),
    full_name: newRocket.name,
    description: newRocket.description,
    image_url: null,
    launch_cost: null,
    maiden_flight: null,
    isLocal: true
  })
}

async function fetchRockets() {
  loading.value = true
  error.value = false

  try {
    const response = await fetch(
      "https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20"
    )

    if (!response.ok) {
      throw new Error("Failed to fetch rockets")
    }

    const data = await response.json()

    rockets.value = data.results
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

const filteredRockets = computed(() => {
  const searchText = search.value.toLowerCase().trim()

  if (!searchText) {
    return rockets.value
  }

  return rockets.value.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(searchText)
  )
})


onMounted(() => {
  fetchRockets()
})
</script>