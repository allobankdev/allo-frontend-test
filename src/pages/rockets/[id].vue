<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRockets } from '@/hooks/rocketLocal'
import type { IRocket } from '@/types/rocket'

import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import RocketHero from '@/components/RocketHero.vue'
import RocketStatsGrid from '@/components/RocketStatsGrid.vue'
import RocketTable from '@/components/RocketTable.vue'

const route = useRoute()
const router = useRouter()
const { getRocket } = useRockets()

const rocket = ref<IRocket | null>(null)
const loading = ref(true)
const error = ref(false)

const load = async () => {
  loading.value = true
  error.value = false

  try {
    rocket.value = await getRocket(route.params.id as string)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <v-container class="py-10">
    <LoadingState v-if="loading" />

    <ErrorState
      v-else-if="error"
      :onRetry="load"
    />

    <template v-else-if="rocket">
      <RocketHero :rocket="rocket" />

      <v-row class="mt-6">
        <v-col cols="12" md="8">
          <p class="text-body-1">
            {{ rocket.description }}
          </p>
        </v-col>
      </v-row>

      <RocketStatsGrid :rocket="rocket" />
      <RocketTable :payloads="rocket.payload_weights" />

      <v-btn
        class="mt-10"
        variant="outlined"
        color="warning"
        @click="router.back()"
      >
        ← Back
      </v-btn>
    </template>
  </v-container>
</template>
