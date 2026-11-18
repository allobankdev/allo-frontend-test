<template>
  <v-container
    class="py-8"
    max-width="900"
  >
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/"
      class="mb-4 px-0"
    >
      Back to list
    </v-btn>

    <AppStateView
      :status="store.detail.status"
      :error="store.detail.error"
      loading-text="Loading rocket details..."
      @retry="load"
    >
      <v-card
        v-if="rocket"
        rounded="lg"
        variant="tonal"
      >
        <RocketImage
          :src="rocket.imageUrl"
          :alt="rocket.name"
          height="320px"
        />

        <v-card-item class="pa-6">
          <v-card-title class="text-h4 font-weight-bold text-wrap">
            {{ rocket.name }}
          </v-card-title>
          <v-card-text class="px-0 pt-4 text-body-1">
            {{ rocket.description ?? 'No description available.' }}
          </v-card-text>
        </v-card-item>

        <v-divider />

        <v-list
          lines="two"
          bg-color="transparent"
        >
          <v-list-item
            prepend-icon="mdi-cash-multiple"
            title="Cost per launch"
          >
            <template #subtitle>
              {{ formatCost(rocket.launchCost) }}
            </template>
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-flag-outline"
            title="Country"
          >
            <template #subtitle>
              {{ rocket.country ?? UNAVAILABLE_TEXT }}
            </template>
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-calendar-start"
            title="First flight"
          >
            <template #subtitle>
              {{ formatDate(rocket.firstFlight) }}
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </AppStateView>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppStateView from '@/components/AppStateView.vue'
import RocketImage from '@/components/RocketImage.vue'
import { useRocketStore } from '@/stores/rockets'
import { formatCost, formatDate, UNAVAILABLE_TEXT } from '@/utils/format'

const route = useRoute()
const store = useRocketStore()

const rocketId = computed(() => String(route.params.id))
const rocket = computed(() => store.detail.rocket)

function load() {
  store.loadRocketDetail(rocketId.value)
}

// Load on mount, and again whenever the route points at a different rocket.
onMounted(load)
watch(rocketId, load)
</script>
