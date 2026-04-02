<template>
  <v-app-bar
    :elevation="2"
    color="primary"
  >
    <v-btn
      icon="mdi-arrow-left"
      @click="router.back()"
    />
    <v-app-bar-title>Rocket Details</v-app-bar-title>
  </v-app-bar>

  <v-main>
    <v-container>
      <div
        v-if="store.loading"
        class="d-flex justify-center align-center h-screen-50"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
      </div>

      <div
        v-else-if="store.error"
        class="d-flex flex-column justify-center align-center h-screen-50"
      >
        <v-icon
          icon="mdi-alert-circle"
          color="error"
          size="64"
          class="mb-4"
        />
        <div class="text-h6 text-error mb-4">
          {{ store.error }}
        </div>
        <v-btn
          color="primary"
          @click="fetchData"
        >
          Retry
        </v-btn>
      </div>

      <v-card
        v-else-if="store.rocket"
        class="mx-auto"
        max-width="800"
      >
        <v-carousel
          v-if="store.rocket.flickr_images.length > 0"
          height="400"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(image, i) in store.rocket.flickr_images"
            :key="i"
            :src="image"
            cover
          />
        </v-carousel>
        <v-img
          v-else
          src="https://via.placeholder.com/800x400?text=No+Image"
          height="400"
          cover
        />

        <v-card-title class="text-h4 mt-4">
          {{ store.rocket.name }}
        </v-card-title>

        <v-card-text>
          <p class="text-body-1 mb-4">
            {{ store.rocket.description }}
          </p>
          
          <v-list lines="one">
            <v-list-item
              title="Country"
              :subtitle="store.rocket.country"
            >
              <template #prepend>
                <v-icon icon="mdi-flag" />
              </template>
            </v-list-item>
            
            <v-list-item
              title="First Flight"
              :subtitle="formatDate(store.rocket.first_flight)"
            >
              <template #prepend>
                <v-icon icon="mdi-calendar" />
              </template>
            </v-list-item>
            
            <v-list-item
              title="Cost per Launch"
              :subtitle="formatCurrency(store.rocket.cost_per_launch)"
            >
              <template #prepend>
                <v-icon icon="mdi-cash" />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const route = useRoute()
const router = useRouter()

const getRocketId = () => {
  const params = route.params as { id?: string }

  return params.id ?? ''
}

const fetchData = async () => {
  const id = getRocketId()

  if (id) {
    await store.fetchRocket(id)
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(value))
}

watch(getRocketId, () => {
  fetchData()
}, { immediate: true })
</script>

<style scoped>
.h-screen-50 {
  height: 50vh
}
</style>
