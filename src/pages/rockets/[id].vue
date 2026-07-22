<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="router.back()"
    >
      Back to List
    </v-btn>

    <StateRenderer 
      :is-loading="isLoading" 
      :is-error="isError" 
      :is-success="isSuccess"
      :error-message="error?.message"
      @retry="refetch"
    >
      <v-row v-if="rocket">
        <v-col
          cols="12"
          md="6"
        >
          <v-carousel
            v-if="rocket.flickr_images && rocket.flickr_images.length"
            height="400"
            hide-delimiter-background
          >
            <v-carousel-item
              v-for="(img, i) in rocket.flickr_images"
              :key="i"
              :src="img"
              cover
            />
          </v-carousel>
          <v-img
            v-else
            src="https://via.placeholder.com/600x400?text=No+Image"
            height="400"
            cover
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <h1 class="text-h3 font-weight-bold mb-4">
            {{ rocket.name }}
          </h1>
          <p class="text-body-1 mb-6">
            {{ rocket.description }}
          </p>
          
          <v-card variant="outlined">
            <v-card-text>
              <v-list lines="one">
                <v-list-item>
                  <template #prepend>
                    <v-icon
                      icon="mdi-cash"
                      color="green-darken-2"
                    />
                  </template>
                  <v-list-item-title>Cost per Launch</v-list-item-title>
                  <v-list-item-subtitle>${{ formatCurrency(rocket.cost_per_launch) }}</v-list-item-subtitle>
                </v-list-item>

                <v-divider inset />

                <v-list-item>
                  <template #prepend>
                    <v-icon
                      icon="mdi-map-marker"
                      color="red-darken-2"
                    />
                  </template>
                  <v-list-item-title>Country</v-list-item-title>
                  <v-list-item-subtitle>{{ rocket.country }}</v-list-item-subtitle>
                </v-list-item>

                <v-divider inset />

                <v-list-item>
                  <template #prepend>
                    <v-icon
                      icon="mdi-calendar"
                      color="blue-darken-2"
                    />
                  </template>
                  <v-list-item-title>First Flight</v-list-item-title>
                  <v-list-item-subtitle>{{ rocket.first_flight }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </StateRenderer>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGetRocket } from '@/services/useRockets'
import { useRocketStore } from '@/stores/rocketStore'
import StateRenderer from '@/components/StateRenderer.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const store = useRocketStore()

// Check if it's a local rocket
const localRocket = computed(() => {
  return store.localRockets.find(r => r.id === id)
})

// Only fetch if it's not a local rocket
const isLocal = computed(() => !!localRocket.value)

const { data: apiRocket, isLoading: apiLoading, isError, isSuccess: apiSuccess, error, refetch } = useGetRocket(isLocal.value ? '' : id)

const isLoading = computed(() => isLocal.value ? false : apiLoading.value)
const isSuccess = computed(() => isLocal.value ? true : apiSuccess.value)

const rocket = computed(() => {
  if (localRocket.value) return localRocket.value
  return apiRocket.value
})

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return '0'
  return value.toLocaleString('en-US')
}
</script>
