<template>
  <v-container>
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
    >
      Back to list
    </v-btn>

    <StateLoading v-if="store.status === 'loading'" />

    <StateError
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets"
    />

    <template v-else-if="store.status === 'success'">
      <p
        v-if="!rocket"
        class="text-body-2 text-on-surface-variant"
      >
        We couldn't find this rocket.
      </p>

      <v-row v-else>
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            :src="rocket.imageUrl ?? undefined"
            :alt="rocket.fullName"
            :aspect-ratio="4 / 3"
            cover
            rounded="lg"
          >
            <template
              v-if="!rocket.imageUrl"
              #placeholder
            >
              <div class="d-flex align-center justify-center fill-height text-caption text-on-surface-variant bg-surface-variant">
                No image
              </div>
            </template>
            <template #error>
              <div class="d-flex align-center justify-center fill-height text-caption text-on-surface-variant bg-surface-variant">
                No image
              </div>
            </template>
          </v-img>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-center ga-2 mb-3">
            <h1 class="text-h5 font-weight-bold">
              {{ rocket.fullName }}
            </h1>
            <span
              v-if="rocket.reusable"
              class="u-badge text-caption font-weight-medium text-primary"
            >
              Reusable
            </span>
          </div>

          <p class="text-body-2 text-on-surface-variant mb-6">
            {{ rocket.description ?? 'No description available.' }}
          </p>

          <dl>
            <div class="d-flex align-baseline justify-space-between ga-4 py-3 u-divider">
              <dt class="text-caption text-on-surface-variant ma-0">
                Cost per launch
              </dt>
              <dd class="text-body-2 font-weight-medium text-right ma-0">
                {{ formatCurrency(rocket.launchCost) }}
              </dd>
            </div>
            <div class="d-flex align-baseline justify-space-between ga-4 py-3 u-divider">
              <dt class="text-caption text-on-surface-variant ma-0">
                Country
              </dt>
              <dd class="text-body-2 font-weight-medium text-right ma-0">
                {{ formatCountry(rocket.countryCode) }}
              </dd>
            </div>
            <div class="d-flex align-baseline justify-space-between ga-4 py-3 u-divider">
              <dt class="text-caption text-on-surface-variant ma-0">
                First flight
              </dt>
              <dd class="text-body-2 font-weight-medium text-right ma-0">
                {{ formatDate(rocket.maidenFlight) }}
              </dd>
            </div>
            <div
              v-if="rocket.family"
              class="d-flex align-baseline justify-space-between ga-4 py-3 u-divider"
            >
              <dt class="text-caption text-on-surface-variant ma-0">
                Family
              </dt>
              <dd class="text-body-2 font-weight-medium text-right ma-0">
                {{ rocket.family }}
              </dd>
            </div>
          </dl>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import { useRoute } from 'vue-router'
import { formatCountry } from '@/utils/countries'
import { formatCurrency, formatDate } from '@/utils/format'

const route = useRoute()
const store = useRocketStore()

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})

const rocket = computed(() => store.findById(route.params.id as string))
</script>