<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/Rockets'
import type { Rocket } from '@/stores/Rockets/model'

const rocketStore = useRocketStore()
const route = useRoute()
const router = useRouter();

const rocket = ref<Rocket>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function loadRocketDetail() {
  try {
    loading.value = true
    error.value = null
    const id = route.params.id as string
    rocket.value = await rocketStore.fetchDetailRocket(id)
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Failed to fetch rocket details'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/')
}

onMounted(async () => {
loadRocketDetail()
})

</script>

<template>
  <v-container
    fluid
    class="pa-0"
  >
    <!-- LOADING STATE -->
    <div
      v-if="loading"
      class="d-flex flex-column align-center justify-center py-10"
    >
      <Loading text="Fetching rockets..." />
    </div>

    <!-- ERROR STATE -->
    <Error
      v-else-if="error"
      title="Failed to Load Data" 
      message="Unable to fetch rocket at the moment." 
      button
    />

    <!-- EMPTY STATE -->
    <Empty
      v-else-if="!rocket"
      title="Empty Data" 
      message="No rockets available yet."
      icon="mdi-rocket-off"
    />

    <div v-else>
      <!-- Hero Section -->
      <div
        v-if="rocket"
        class="relative"
      >
        <div class="position-relative">
          <v-img
            :src="rocket.flickr_images[0]"
            height="400px"
            cover
          />
          <!-- Back Button -->
          <v-btn
            color="black"
            variant="tonal"
            class="ma-4"
            prepend-icon="mdi-arrow-left"
            style="position: absolute; top: 3px; left: 16px; z-index: 20;"
            @click="goBack"
          >
            Back
          </v-btn>
        </div>
  
        <!-- Overlay -->
        <div class="absolute top-0 left-0 w-100 h-100 d-flex align-center px-8">
          <v-row no-gutters>
            <v-col
              cols="12"
              md="3"
              class="d-flex justify-center"
            >
              <v-img
                :src="rocket.flickr_images[0]"
                height="280"
                width="200"
                class="rounded-lg elevation-4 border"
                style="border: 2px solid #e0e0e0;"
                cover
              />
            </v-col>
            <v-col
              cols="12"
              md="9"
              class="pl-md-8"
            >
              <h2 class="text-h4 font-weight-bold mb-2">
                {{ rocket.rocket_name }}
              </h2>
              <p class="text-subtitle-1 mb-4">
                Country: {{ rocket.country }}
              </p>
              <p class="text-subtitle-1 mb-4">
                First flight: {{ new Date(rocket.first_flight).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
              </p>
              <div class="d-flex flex-column gap-2">
                <div class="d-flex align-center gap-4">
                  <v-icon
                    color="amber"
                    class="my-2"
                  >
                    mdi-cash
                  </v-icon>
                  <p>
                    Cost per launch: ${{ rocket?.cost_per_launch?.toLocaleString() }}
                  </p>
                </div>
  
                <div class="d-flex align-center gap-4">
                  <v-icon
                    color="blue"
                    class="my-2"
                  >
                    mdi-flag
                  </v-icon>
                  <p>{{ rocket?.country }}</p>
                </div>
  
                <div class="d-flex align-center gap-4">
                  <v-icon
                    color="green"
                    class="my-2"
                  >
                    mdi-calendar
                  </v-icon>
                  <p>{{ rocket?.first_flight }}</p>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
  
      <!-- Content -->
      <v-container>
        <h3 class="text-h6 font-weight-bold mb-2">
          Description
        </h3>
        <p class="text-body-1">
          {{ rocket?.description }}
        </p>
      </v-container>
    </div>
  </v-container>
</template>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.brightness-50 {
  filter: brightness(50%);
}
</style>
