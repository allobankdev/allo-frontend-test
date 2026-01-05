<template>
  <v-app-bar flat>
    <v-btn icon="mdi-arrow-left" variant="text" @click="goBack" />
    <v-app-bar-title class="font-weight-bold">Rocket Detail</v-app-bar-title>
  </v-app-bar>

  <v-main>
    <v-container class="py-6">
      <UiLoading v-if="store.status === 'loading' && !rocket" />

      <UiErrorRetry
        v-else-if="store.status === 'error' && !rocket"
        :message="store.error"
        @retry="store.loadRockets({ force: true })"
      />

      <v-alert
        v-else-if="!rocket"
        type="warning"
        variant="tonal"
        rounded="lg"
      >
        Rocket not found.
      </v-alert>

      <v-card v-else rounded="lg" variant="outlined">
        <v-img :src="rocket.imageUrl || fallback" height="320" cover />

        <v-card-title class="text-h5 font-weight-bold">
          {{ rocket.name }}
        </v-card-title>

        <v-card-text>
          <div class="text-body-1 mb-4">{{ rocket.description }}</div>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-list density="compact">
                <v-list-item title="Cost per launch" :subtitle="formatUsd(rocket.cost_per_launch)" />
                <v-list-item title="Country" :subtitle="rocket.country" />
                <v-list-item title="First flight" :subtitle="formatDate(rocket.first_flight)" />
              </v-list>
            </v-col>
            <v-col cols="12" sm="6">
              <v-alert
                v-if="rocket.isLocal"
                type="info"
                variant="tonal"
                rounded="lg"
              >
                This rocket was added locally (not from the SpaceX API).
              </v-alert>

              <v-chip
                v-if="rocket.active !== undefined"
                class="mt-2"
                label
                :color="rocket.active ? 'success' : 'warning'"
                variant="tonal"
              >
                {{ rocket.active ? 'Active' : 'Inactive' }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import UiLoading from '@/components/UiLoading.vue'
import UiErrorRetry from '@/components/UiErrorRetry.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const fallback = 'https://via.placeholder.com/1024x576?text=Rocket'

const rocketId = computed(() => String(route.params.id ?? ''))
const rocket = computed(() => store.getById(rocketId.value))

function goBack () {
  // Prefer history back, but fallback to list.
  if (window.history.length > 1) router.back()
  else router.push({ path: '/rockets' })
}

function formatUsd (value: number) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
  } catch {
    return `$${value}`
  }
}

function formatDate (value: string) {
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

onMounted(async () => {
  // Lifecycle: ensure data exists when detail screen is mounted (deep-link support)
  if (!rocket.value) {
    await store.loadRockets()
  }
})

watch(rocketId, async () => {
  // When navigating between details, ensure the rocket exists.
  if (!rocket.value) {
    await store.loadRockets()
  }
})
</script>
