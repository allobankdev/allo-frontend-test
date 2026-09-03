<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useRocketStore } from '@/store/rocketStore'
import RequestStateHandler from '@/components/RequestStateHandler.vue'
import RocketImage from '@/components/RocketImage.vue'
import DetailField from '@/components/DetailField.vue'
import { formatLaunchCost, formatDate, formatCountry, withFallback } from '@/utils/formatters'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()
const rocketStore = useRocketStore()

const rocket = computed(() => rocketStore.getRocketById(props.id))

onMounted(() => {
  if (!rocket.value) {
    rocketStore.fetchRockets()
  }
})

const description = computed(() => withFallback(rocket.value?.description, 'No description available.'))
</script>

<template>
  <div>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="router.push({ name: 'rocket-list' })">
      Back to list
    </v-btn>

    <RequestStateHandler
      :status="rocket ? 'success' : rocketStore.status"
      :error-message="rocketStore.errorMessage"
      loading-text="Fetching rocket details..."
      @retry="rocketStore.fetchRockets"
    >
      <v-row v-if="rocket">
        <v-col cols="12" md="5">
          <v-card elevation="2">
            <RocketImage :src="rocket.imageUrl" :alt="rocket.name || 'Rocket'" height="320" />
          </v-card>
        </v-col>

        <v-col cols="12" md="7">
          <h1 class="text-h4 font-weight-bold mb-2">{{ rocket.name || 'Unnamed rocket' }}</h1>
          <p class="text-body-1 mb-6">{{ description }}</p>

          <v-card variant="outlined">
            <v-card-text>
              <DetailField icon="mdi-currency-usd" label="Cost per launch" :value="formatLaunchCost(rocket.launchCost)" />
              <v-divider />
              <DetailField icon="mdi-earth" label="Country" :value="formatCountry(rocket.country)" />
              <v-divider />
              <DetailField icon="mdi-calendar-star" label="First flight" :value="formatDate(rocket.firstFlight)" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div v-else class="d-flex flex-column align-center justify-center py-16 text-medium-emphasis">
        <v-icon icon="mdi-rocket-outline" size="40" class="mb-2" />
        <p>We couldn't find that rocket.</p>
      </div>
    </RequestStateHandler>
  </div>
</template>
