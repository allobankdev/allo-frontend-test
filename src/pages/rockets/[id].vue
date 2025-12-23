<template>
  <v-container class="py-8">
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.push('/')"
    >
      Back to List
    </v-btn>

    <div v-if="rocketStore.isLoading">
      <LoadingState />
    </div>

    <div v-else-if="rocketStore.isError">
      <ErrorState
        :message="rocketStore.error || 'Failed to load rocket details'"
        @retry="handleRetry"
      />
    </div>

    <v-card v-else-if="rocketStore.selectedRocket" class="rocket-detail-card">
      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-img
            :src="rocketStore.selectedRocket.flickr_images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'"
            :alt="rocketStore.selectedRocket.name"
            height="100%"
            min-height="400"
            cover
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-card-title class="text-h4 pa-6">
            {{ rocketStore.selectedRocket.name }}
          </v-card-title>
          <v-card-text class="pa-6">
            <p class="text-body-1 mb-6">
              {{ rocketStore.selectedRocket.description }}
            </p>

            <v-divider class="my-4" />

            <v-row>
              <v-col cols="12" sm="6">
                <div class="mb-4">
                  <div class="text-caption text-grey mb-1">Cost per Launch</div>
                  <div class="text-h6">
                    {{ formatCurrency(rocketStore.selectedRocket.cost_per_launch) }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="mb-4">
                  <div class="text-caption text-grey mb-1">Country</div>
                  <div class="text-h6">
                    {{ rocketStore.selectedRocket.country }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="mb-4">
                  <div class="text-caption text-grey mb-1">First Flight</div>
                  <div class="text-h6">
                    {{ formatDate(rocketStore.selectedRocket.first_flight) }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" v-if="rocketStore.selectedRocket.active !== undefined">
                <div class="mb-4">
                  <div class="text-caption text-grey mb-1">Status</div>
                  <v-chip
                    :color="rocketStore.selectedRocket.active ? 'success' : 'error'"
                    size="small"
                  >
                    {{ rocketStore.selectedRocket.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const route = useRoute()
const rocketStore = useRocketStore()

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await rocketStore.loadRocketById(id)
  }
})

onUnmounted(() => {
  rocketStore.clearSelectedRocket()
})

function handleRetry() {
  const id = route.params.id as string
  if (id) {
    rocketStore.loadRocketById(id)
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
</script>

<style scoped>
.rocket-detail-card {
  overflow: hidden;
}
</style>

