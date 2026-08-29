<template>
  <v-container>
    <v-row v-if="store.loading" justify="center" class="mt-10">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <div v-else-if="rocket">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="text"
        class="mb-4"
        @click="$router.push('/')"
      >
        Back to List
      </v-btn>

      <v-row>
        <v-col cols="12" md="6">
          <v-carousel hide-delimiters show-arrows="hover" height="400" class="rounded-lg">
            <v-carousel-item
              v-for="(image, i) in rocket.flickr_images"
              :key="i"
              :src="image"
              cover
            />
          </v-carousel>
        </v-col>

        <v-col cols="12" md="6">
          <h1 class="text-h3 font-weight-bold">{{ rocket.name }}</h1>
          <v-chip color="secondary" class="mt-2">{{ rocket.country }}</v-chip>

          <p class="text-body-1 mt-6">{{ rocket.description }}</p>

          <v-list class="mt-6 bg-transparent">
            <v-list-item>
              <template v-slot:prepend><v-icon icon="mdi-currency-usd" color="success" /></template>
              <v-list-item-title class="font-weight-bold">Cost Per Launch</v-list-item-title>
              <v-list-item-subtitle>${{ rocket.cost_per_launch?.toLocaleString() }}</v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend><v-icon icon="mdi-calendar-rocket" color="info" /></template>
              <v-list-item-title class="font-weight-bold">First Flight</v-list-item-title>
              <v-list-item-subtitle>{{ rocket.first_flight }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </div>

    <v-alert
      v-else
      type="warning"
      title="Rocket Not Found"
      text="We couldn't find the details for this rocket. It might have been deleted or the ID is incorrect."
      class="mt-10"
    >
      <v-btn color="white" variant="outlined" class="mt-4" to="/">Return to Home</v-btn>
    </v-alert>
  </v-container>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { computed, onMounted } from 'vue'

const route = useRoute()
const store = useRocketStore()

// Get the ID from the URL parameter /rocket/:id
const rocketId = computed(() => route.params.id as string)

// Find the rocket in the store
const rocket = computed(() => store.getRocketById(rocketId.value))

onMounted(async () => {
  if (store.rockets.length === 0) {
    await store.fetchRockets()
  }
})
</script>
