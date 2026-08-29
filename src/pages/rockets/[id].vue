<template>
  <div class="rocket-detail-page">
    <v-container class="py-6">
      <v-btn
        class="back-button"
        prepend-icon="mdi-arrow-left"
        variant="text"
        size="large"
        @click="router.push('/')"
      >
        Back
      </v-btn>

      <div v-if="rocketStore.isLoading" class="loading-container">
        <LoadingState />
      </div>

      <div v-else-if="rocketStore.isError" class="error-container">
        <ErrorState
          :message="rocketStore.error || 'Failed to load rocket details'"
          @retry="handleRetry"
        />
      </div>

      <div v-else-if="rocketStore.selectedRocket" class="rocket-detail-content">
        <div class="detail-grid">
          <div class="detail-image">
            <v-img
              :src="rocketStore.selectedRocket.flickr_images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'"
              :alt="rocketStore.selectedRocket.name"
              height="100%"
              min-height="500"
              cover
              class="rounded-lg"
            />
          </div>
          <div class="detail-info">
            <h1 class="text-h3 font-weight-light mb-3">
              {{ rocketStore.selectedRocket.name }}
            </h1>
            <p class="text-body-1 text-medium-emphasis mb-8 line-height-relaxed">
              {{ rocketStore.selectedRocket.description }}
            </p>

            <div class="detail-specs">
              <div class="spec-item">
                <div class="spec-label">Cost per Launch</div>
                <div class="spec-value">
                  {{ formatCurrency(rocketStore.selectedRocket.cost_per_launch) }}
                </div>
              </div>
              <div class="spec-item">
                <div class="spec-label">Country</div>
                <div class="spec-value">
                  {{ rocketStore.selectedRocket.country }}
                </div>
              </div>
              <div class="spec-item">
                <div class="spec-label">First Flight</div>
                <div class="spec-value">
                  {{ formatDate(rocketStore.selectedRocket.first_flight) }}
                </div>
              </div>
              <div
                v-if="rocketStore.selectedRocket.active !== undefined"
                class="spec-item"
              >
                <div class="spec-label">Status</div>
                <div class="spec-value">
                  <v-chip
                    :color="rocketStore.selectedRocket.active ? 'success' : 'error'"
                    size="small"
                    variant="flat"
                  >
                    {{ rocketStore.selectedRocket.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
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
.rocket-detail-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-surface));
}

.back-button {
  margin-bottom: 32px;
  padding-left: 0 !important;
  min-width: auto;
  text-transform: none;
  letter-spacing: normal;
}

.back-button :deep(.v-btn__prepend) {
  margin-inline-end: 8px;
}

.loading-container,
.error-container {
  max-width: 1200px;
  margin: 0 auto;
}

.rocket-detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

.detail-image {
  position: sticky;
  top: 24px;
}

.detail-info {
  padding-top: 8px;
}

.detail-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(var(--v-border-opacity), var(--v-border-opacity));
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.spec-value {
  font-size: 1.125rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

.line-height-relaxed {
  line-height: 1.7;
}

@media (max-width: 960px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .detail-image {
    position: static;
  }

  .detail-specs {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>

