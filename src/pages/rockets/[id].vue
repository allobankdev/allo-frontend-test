<template>
  <v-container
    class="py-8"
    style="max-width: 960px"
  >
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to list
    </v-btn>

    <AsyncState
      :error="error"
      loading-text="Loading rocket..."
      :status="status"
      @retry="load"
    >
      <v-card v-if="rocket">
        <RocketImage
          :alt="rocket.name"
          height="360"
          :src="rocket.imageUrl"
        />
        <v-card-title class="text-h5 text-wrap">
          {{ rocket.name }}
        </v-card-title>
        <v-card-text>
          <p class="mb-6">
            {{ rocket.description || 'No description available.' }}
          </p>
          <v-row>
            <v-col
              cols="12"
              sm="4"
            >
              <InfoRow
                label="Cost per launch"
                :value="formatCurrency(rocket.launchCost)"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <InfoRow
                label="Country"
                :value="orFallback(rocket.country)"
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <InfoRow
                label="First flight"
                :value="formatDate(rocket.firstFlight)"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </AsyncState>
  </v-container>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '@/stores/rocket'
  import { formatCurrency, formatDate, orFallback } from '@/utils/format'
  import type { AsyncStatus, Rocket } from '@/types/rocket'

  const route = useRoute()
  const store = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)

  async function load () {
    status.value = 'loading'
    error.value = null
    try {
      const id = String((route.params as Record<string, string | string[]>).id)
      rocket.value = await store.getRocket(id)
      status.value = 'success'
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load rocket'
      status.value = 'error'
    }
  }

  watch(() => (route.params as Record<string, string | string[]>).id, load, { immediate: true })
</script>

