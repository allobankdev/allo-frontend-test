<template>
  <v-container
    class="py-6 px-4"
    style="max-width: 800px;"
  >
    <!-- Top Back Navigation -->
    <div class="mb-4">
      <v-btn
        variant="text"
        color="steel"
        size="small"
        class="text-none font-mono px-0"
        @click="goBack"
      >
        <v-icon
          icon="mdi-arrow-left"
          class="mr-1"
        />
        Back to manifest
      </v-btn>
    </div>

    <!-- Loading State (if fetching fallback) -->
    <LoadingState v-if="store.status === 'loading'" />

    <!-- Error State -->
    <ErrorState
      v-else-if="store.status === 'error'"
      :error-message="store.errorMessage"
      @retry="store.retry()"
    />

    <!-- Rocket Not Found -->
    <v-card
      v-else-if="!rocket"
      class="my-6 pa-6 text-center border-line bg-surface"
      variant="outlined"
    >
      <v-icon
        icon="mdi-help-circle-outline"
        color="steel"
        size="36"
        class="mb-2"
      />
      <div class="text-body-1 font-weight-medium text-onSurface">
        Rocket specification not found.
      </div>
      <p class="text-caption text-steel font-mono mt-1 mb-3">
        ID "{{ rocketId }}" does not match any entry in the manifest.
      </p>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        class="text-none"
        @click="goBack"
      >
        Return to manifest
      </v-btn>
    </v-card>

    <!-- Rocket Spec Sheet -->
    <div
      v-else
      class="rocket-spec-sheet"
    >
      <v-card
        class="pa-6 border-line bg-surface"
        variant="outlined"
      >
        <!-- Header & Badges -->
        <div class="d-flex align-center justify-space-between mb-4 border-bottom-line pb-3">
          <div>
            <span class="spec-label">VEHICLE SPECIFICATION</span>
            <h1 class="text-h4 font-weight-bold text-onSurface mt-1">
              {{ rocket.fullName || 'Not available' }}
            </h1>
          </div>
          <v-chip
            v-if="rocket.isLocal"
            color="primary"
            variant="flat"
            size="small"
            class="font-mono"
          >
            LOCAL ENTRY
          </v-chip>
          <v-chip
            v-else
            color="steel"
            variant="flat"
            size="small"
            class="font-mono font-weight-bold"
          >
            SPACEX API
          </v-chip>
        </div>

        <!-- Vehicle Image -->
        <div class="my-4 text-center">
          <v-img
            v-if="rocket.imageUrl"
            :src="rocket.imageUrl"
            :alt="rocket.fullName || 'Rocket image'"
            max-height="320"
            cover
            class="rounded-sm border-line bg-paper"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height bg-surface py-8">
                <v-icon
                  icon="mdi-rocket-launch-outline"
                  color="steel"
                  size="48"
                />
              </div>
            </template>
          </v-img>
          <v-card
            v-else
            class="pa-8 text-center bg-paper border-line"
            variant="flat"
          >
            <v-icon
              icon="mdi-image-off-outline"
              color="steel"
              size="48"
              class="mb-2"
            />
            <div class="spec-label">
              IMAGE NOT AVAILABLE
            </div>
          </v-card>
        </div>

        <!-- Overview Description -->
        <div class="my-6">
          <span class="spec-label d-block mb-2">VEHICLE OVERVIEW</span>
          <p class="text-body-1 text-onSurface style-description">
            {{ rocket.description || 'Not available' }}
          </p>
        </div>

        <v-divider class="my-6" />

        <!-- Technical Specification Data Sheet -->
        <div>
          <span class="spec-label d-block mb-3">TECHNICAL DATA SHEET</span>
          
          <v-table
            class="bg-surface font-mono spec-table"
            density="comfortable"
          >
            <tbody>
              <tr>
                <td class="spec-label py-3">
                  COST PER LAUNCH
                </td>
                <td class="spec-value text-right py-3">
                  {{ rocket.launchCost || 'Not available' }}
                </td>
              </tr>
              <tr>
                <td class="spec-label py-3">
                  COUNTRY OF ORIGIN
                </td>
                <td class="spec-value text-right py-3">
                  {{ rocket.country || 'Not available' }}
                </td>
              </tr>
              <tr>
                <td class="spec-label py-3">
                  FIRST FLIGHT DATE
                </td>
                <td class="spec-value text-right py-3">
                  {{ rocket.maidenFlight || 'Not available' }}
                </td>
              </tr>
              <tr>
                <td class="spec-label py-3">
                  VEHICLE ID
                </td>
                <td class="spec-value text-right py-3 text-steel">
                  {{ rocket.id }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketsStore } from '@/stores/rockets'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketsStore()

const rocketId = computed(() => String(route.params.id || ''))
const rocket = computed(() => store.getRocketById(rocketId.value))

onMounted(async () => {
  if (store.rockets.length === 0) {
    await store.fetchRockets()
  }
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.style-description {
  line-height: 1.6;
}
.spec-table {
  border: 1px solid #C7C2B6;
}
.spec-table td {
  border-bottom: 1px solid #C7C2B6 !important;
}
.spec-table tr:last-child td {
  border-bottom: none !important;
}
</style>
