<template>
  <v-container>
    <h1 class="mb-4">SpaceX Rockets</h1>

    <StateLoading v-if="store.status === 'loading'" />

    <StateError
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets"
    />

    <v-row v-else-if="store.status === 'success'">
      <v-col
        v-for="rocket in store.rockets"
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
import { onMounted } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()

onMounted(() => {
  store.fetchRockets()
})
</script>
