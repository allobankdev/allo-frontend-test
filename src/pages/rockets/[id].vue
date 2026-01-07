<template>
  <v-container>
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="goBack"
    >
      Back to Rocket List
    </v-btn>

    <LoadingState v-if="store.isLoading && !rocket" message="Loading rocket details..." />

    <ErrorState
      v-else-if="store.error && !rocket"
      :message="store.error"
      @retry="handleRetry"
    />

    <div v-else-if="rocket" class="rocket-detail">
      <v-row>
        <v-col cols="12" md="6">
          <v-img
            v-if="rocket.flickr_images && rocket.flickr_images.length > 0"
            :src="rocket.flickr_images[0]"
            :alt="rocket.name"
            height="500"
            cover
            class="rounded-lg"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-5"
                  indeterminate
                />
              </div>
            </template>
          </v-img>
          <v-img
            v-else
            src="https://via.placeholder.com/600x500?text=No+Image"
            :alt="rocket.name"
            height="500"
            cover
            class="rounded-lg"
          />

          <!-- Additional Images -->
          <div v-if="rocket.flickr_images && rocket.flickr_images.length > 1" class="mt-4">
            <div class="text-subtitle-2 mb-2">Additional Images</div>
            <v-row>
              <v-col
                v-for="(image, index) in rocket.flickr_images.slice(1, 5)"
                :key="index"
                cols="6"
                sm="3"
              >
                <v-img
                  :src="image"
                  :alt="`${rocket.name} image ${index + 2}`"
                  height="100"
                  cover
                  class="rounded"
                  style="cursor: pointer;"
                  @click="selectedImage = image"
                />
              </v-col>
            </v-row>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="text-h3 mb-4">{{ rocket.name }}</div>

          <v-card class="mb-4">
            <v-card-text>
              <div class="text-body-1">{{ rocket.description }}</div>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="12" sm="6">
              <v-card>
                <v-card-text>
                  <div class="text-subtitle-2 text-medium-emphasis mb-1">
                    Cost per Launch
                  </div>
                  <div class="text-h6">
                    ${{ rocket.cost_per_launch.toLocaleString() }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card>
                <v-card-text>
                  <div class="text-subtitle-2 text-medium-emphasis mb-1">
                    Country
                  </div>
                  <div class="text-h6">{{ rocket.country }}</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card>
                <v-card-text>
                  <div class="text-subtitle-2 text-medium-emphasis mb-1">
                    First Flight
                  </div>
                  <div class="text-h6">{{ rocket.first_flight }}</div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6">
              <v-card>
                <v-card-text>
                  <div class="text-subtitle-2 text-medium-emphasis mb-1">
                    Status
                  </div>
                  <v-chip
                    :color="rocket.active ? 'success' : 'default'"
                    size="small"
                  >
                    {{ rocket.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-card v-if="rocket.company" class="mt-4">
            <v-card-text>
              <div class="text-subtitle-2 text-medium-emphasis mb-1">
                Company
              </div>
              <div class="text-h6">{{ rocket.company }}</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Image Dialog -->
    <v-dialog v-model="showImageDialog" max-width="900">
      <v-card v-if="selectedImage">
        <v-img
          :src="selectedImage"
          max-height="600"
          contain
        />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showImageDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const selectedImage = ref<string | null>(null)
const showImageDialog = computed({
  get: () => selectedImage.value !== null,
  set: (value) => {
    if (!value) selectedImage.value = null
  },
})

const rocketId = computed(() => route.params.id as string)

const rocket = computed(() => {
  return store.rockets.find(r => r.id === rocketId.value)
})

// Lifecycle hook - fetch rocket details when component is mounted
onMounted(async () => {
  if (!rocket.value) {
    try {
      await store.fetchRocketById(rocketId.value)
    } catch (error) {
      console.error('Failed to fetch rocket:', error)
    }
  }
})

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId && typeof newId === 'string') {
    const existingRocket = store.rockets.find(r => r.id === newId)
    if (!existingRocket) {
      try {
        await store.fetchRocketById(newId)
      } catch (error) {
        console.error('Failed to fetch rocket:', error)
      }
    }
  }
})

function goBack() {
  router.push('/')
}

function handleRetry() {
  store.clearError()
  store.fetchRocketById(rocketId.value)
}
</script>

<style scoped>
.rocket-detail {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

