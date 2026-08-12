<template>
  <v-container class="py-8">
    <h1 class="text-h4 font-weight-bold mb-6">
      SpaceX Rockets
    </h1>

    <LoadingState v-if="store.status === 'loading'" />

    <ErrorState
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets"
    />

    <v-row v-else>
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

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRocketsStore } from '@/stores/rockets'

  const store = useRocketsStore()

  onMounted(() => {
    if (store.status === 'idle') {
      store.fetchRockets()
    }
  })
</script>
