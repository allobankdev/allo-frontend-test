<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { getRocketById } from '@/api/spacex'
import type { Rocket } from '@/types/rocket'

import UiState from '@/components/UiState.vue'

/* ----------------------------------
 * Router
 * ---------------------------------- */
const route = useRoute()
const router = useRouter()

const rocketId = computed(() => route.params.id as string)

/* ----------------------------------
 * State
 * ---------------------------------- */
const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<unknown>(null)

/* ----------------------------------
 * Methods
 * ---------------------------------- */
const fetchDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await getRocketById(rocketId.value)
    rocket.value = res.data
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

/* ----------------------------------
 * Lifecycle
 * ---------------------------------- */
onMounted(fetchDetail)
</script>

<template>
  <v-container>
    <!-- Back Button -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="router.back()"
    >
      Back
    </v-btn>

    <!-- Loading / Error -->
    <UiState
      v-if="loading || error"
      :loading="loading"
      :error="error"
      @retry="fetchDetail"
    />

    <!-- Skeleton (initial state) -->
    <v-card v-else-if="!rocket">
      <v-skeleton-loader
        type="image"
        height="360"
      />
      <v-card-text>
        <v-skeleton-loader type="heading" class="mb-2" />
        <v-skeleton-loader type="paragraph" />
      </v-card-text>
    </v-card>

    <!-- Rocket Detail -->
    <v-card v-else>
      <!-- Image Carousel (FIT / CONTAIN) -->
      <v-carousel
        v-if="rocket.flickr_images?.length"
        height="360"
        show-arrows
        hide-delimiters
        cycle
        interval="4000"
      >
        <v-carousel-item
          v-for="(img, index) in rocket.flickr_images"
          :key="index"
        >
          <v-img
            :src="img"
            height="360"
            contain
            class="d-flex align-center justify-center bg-grey-darken-3"
          >
            <template #placeholder>
              <v-skeleton-loader type="image" />
            </template>
          </v-img>
        </v-carousel-item>
      </v-carousel>

      <!-- Fallback image -->
      <v-img
        v-else
        height="360"
        src="https://via.placeholder.com/800x400?text=No+Image"
        contain
        class="bg-grey-darken-3"
      />

      <!-- Content -->
      <v-card-title class="text-h5 font-weight-bold">
        {{ rocket.name }}
      </v-card-title>

      <v-card-text>
        <p class="mb-4">
          {{ rocket.description }}
        </p>

        <v-divider class="mb-4" />

        <v-row>
          <v-col cols="12" md="4">
            <strong>Cost per Launch</strong>
            <div>
              ${{ rocket.cost_per_launch?.toLocaleString() }}
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <strong>Country</strong>
            <div>{{ rocket.country }}</div>
          </v-col>

          <v-col cols="12" md="4">
            <strong>First Flight</strong>
            <div>{{ rocket.first_flight }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>
