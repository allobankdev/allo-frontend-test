<template>
  <v-container>
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
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
        class="text-medium-emphasis"
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
            height="280"
            cover
            class="rounded"
          >
            <template
              v-if="!rocket.imageUrl"
              #placeholder
            >
              <div class="d-flex align-center justify-center fill-height text-medium-emphasis">
                No image
              </div>
            </template>
          </v-img>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <h1>{{ rocket.fullName }}</h1>
          <p class="mb-4">
            {{ rocket.description ?? 'No description available.' }}
          </p>

          <v-list density="compact">
            <v-list-item
              title="Cost per launch"
              :subtitle="formatCost(rocket.launchCost)"
            />
            <v-list-item
              title="Country"
              :subtitle="rocket.countryCode ?? 'Not available'"
            />
            <v-list-item
              title="First flight"
              :subtitle="rocket.maidenFlight ?? 'Not available'"
            />
          </v-list>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rockets'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useRocketStore()

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})

const rocket = computed(() => store.findById(route.params.id as string))

function formatCost(cost: number | null): string {
  if (cost === null) return 'Not available'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cost)
}
</script>