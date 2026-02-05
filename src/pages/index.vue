<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'

const rocketStore = useRocketStore()
const search = ref('')
const newRocketName = ref('')


onMounted(() => {
  rocketStore.fetchRockets()
})

const filteredRockets = computed(() => {
  return rocketStore.rockets.filter(r =>
    r?.name?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const addRocket = () => {

  if (!newRocketName.value.trim()) return

  rocketStore.addRocket({
    id: Date.now().toString(),
    name: newRocketName.value,
    description: 'User created rocket',
    flickr_images: []
  })

  newRocketName.value = ''
}
</script>

<template>
  <div>
    <h1 class="mb-4">Rocket List</h1>

    <v-text-field
      v-model="newRocketName"
      label="New Rocket Name"
      placeholder="Enter rocket name..."
      variant="outlined"
      class="mb-2"
    />

    <v-btn
      class="mb-6"
      :disabled="!newRocketName.trim()"
      @click="addRocket"
    >
      Add Rocket
    </v-btn>

    <v-text-field
      v-model="search"
      label="Search rockets..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      class="mb-4"
    />

    <div v-if="rocketStore.loading" class="text-center">
      <v-progress-circular indeterminate />
    </div>

    <div v-else-if="rocketStore.error" class="text-center">
      <p>{{ rocketStore.error }}</p>

      <v-btn @click="rocketStore.fetchRockets()">
        Retry
      </v-btn>
    </div>

    <v-container v-else>
      <v-row>

        <v-col
          v-if="filteredRockets.length === 0"
          cols="12"
          class="text-center"
        >
          <p>No rockets found</p>
        </v-col>

        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>

      </v-row>
    </v-container>

  </div>
</template>
