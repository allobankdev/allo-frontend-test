<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'

const route = useRoute()
const rocketStore = useRocketStore()

onMounted(() => {
  rocketStore.fetchRocketById(route.params.id as string)
})
</script>

<template>

  <v-container v-if="rocketStore.loading">
    <v-progress-circular indeterminate />
  </v-container>

  <v-container v-else-if="rocketStore.error">
    <p>{{ rocketStore.error }}</p>

    <v-btn @click="rocketStore.fetchRocketById(route.params.id as string)">
      Retry
    </v-btn>
  </v-container>

  <v-container v-else-if="rocketStore.rocketDetail">

    <v-img
      :src="rocketStore.rocketDetail.flickr_images?.[0]"
      height="400"
      cover
    />

    <h1>{{ rocketStore.rocketDetail.name }}</h1>

    <p>{{ rocketStore.rocketDetail.description }}</p>

    <p><b>Country:</b> {{ rocketStore.rocketDetail.country }}</p>
    <p><b>Cost per launch:</b> ${{ rocketStore.rocketDetail.cost_per_launch }}</p>
    <p><b>First flight:</b> {{ rocketStore.rocketDetail.first_flight }}</p>

  </v-container>

</template>
