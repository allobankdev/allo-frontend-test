<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="router.push('/')"
    >
      Back to Rockets
    </v-btn>

    <Skeleton
      :state="store.detailLoadingState"
      :message="store.detailErrorMessage"
      detail
      @retry="loadDetail()"
    >
      <template v-if="store.currentRocket">
        <v-row class="detail__rocket px-5 py-5">
          <!-- Rocket Image -->
          <v-col cols="12" md="6">
            <v-carousel
              v-if="store.currentRocket.flickr_images.length > 1"
              height="400"
              show-arrows="hover"
              cycle
              hide-delimiter-background
            >
              <v-carousel-item
                v-for="(image, i) in store.currentRocket.flickr_images"
                :key="i"
                :src="image"
                cover
              />
            </v-carousel>

            <v-img
              v-else
              :src="store.currentRocket.flickr_images[0] || ''"
              height="400"
              cover
              rounded="lg"
            >
              <template #placeholder>
                <v-row class="fill-height" align="center" justify="center">
                  <v-progress-circular indeterminate color="white" />
                </v-row>
              </template>

              <template #error>
                <v-row class="fill-height bg-grey-darken-3" align="center" justify="center">
                  <v-icon size="64" color="grey">mdi-rocket-launch-outline</v-icon>
                </v-row>
              </template>
            </v-img>
          </v-col>

          <!-- Rocket Details -->
          <v-col cols="12" md="6">
            <div class="d-flex align-center mb-2">
              <h1 class="text-h3 font-weight-bold">
                {{ store.currentRocket.name }}
              </h1>
              <v-chip
                v-if="isLocal"
                class="ml-3 mt-3"
                color="white"
                variant="outlined"
                size="small"
                style="letter-spacing: 0;"
              >
                Local
              </v-chip>
            </div>

            <p class="text-body-1 mb-6">
              {{ store.currentRocket.description }}
            </p>

            <v-list lines="two" bg-color="transparent" class="pa-0">
              <v-list-item prepend-icon="mdi-send-variant-outline">
                <v-list-item-title class="font-weight-bold">Cost Per Launch</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatCurrency(store.currentRocket.cost_per_launch) }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item prepend-icon="mdi-send-variant-outline">
                <v-list-item-title class="font-weight-bold">Country</v-list-item-title>
                <v-list-item-subtitle>  
                  {{ store.currentRocket.country }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item prepend-icon="mdi-send-variant-outline">
                <v-list-item-title class="font-weight-bold">First Flight</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(store.currentRocket.first_flight) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </template>
    </Skeleton>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import Skeleton from '@/components/Skeleton.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const isLocal = computed(() => {
  return store.currentRocket && 'isLocal' in store.currentRocket && store.currentRocket.isLocal
})

function loadDetail() {
  const id = route.params.id as string
  store.loadRocketDetail(id)
}

onMounted(() => {
  loadDetail()
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.detail__rocket {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  letter-spacing: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}
</style>