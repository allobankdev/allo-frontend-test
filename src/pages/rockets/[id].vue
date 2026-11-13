<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Kembali
    </v-btn>

    <!-- Loading -->
    <v-row v-if="status === 'loading'">
      <v-col
        cols="12"
        md="6"
      >
        <v-skeleton-loader type="image" />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-skeleton-loader type="heading, paragraph, list-item, list-item, list-item" />
      </v-col>
    </v-row>

    <!-- Fail / Retry -->
    <ErrorState
      v-else-if="status === 'error'"
      :message="error"
      @retry="load"
    />

    <!-- Success -->
    <v-row v-else-if="rocket">
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <RocketImage
            :alt="rocket.full_name"
            :src="rocket.image_url"
          />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <h1 class="text-h4 mb-2">
          {{ rocket.full_name }}
        </h1>
        <p class="mb-6">
          {{ formatText(rocket.description) }}
        </p>
        <v-divider />
        <InfoRow
          label="Cost per launch"
          :value="formatCost(rocket.launch_cost)"
        />
        <v-divider />
        <InfoRow
          label="Country"
          :value="formatText(rocket.manufacturer?.country_code)"
        />
        <v-divider />
        <InfoRow
          label="First flight"
          :value="formatDate(rocket.maiden_flight)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router/auto'
  import { fetchRocketById } from '@/api/rocketApi'
  import { useRocketStore } from '@/stores/rocketStore'
  import { formatCost, formatDate, formatText } from '@/utils/formatters'
  import type { LoadStatus } from '@/stores/rocketStore'
  import type { Rocket } from '@/types/rocket'

  const route = useRoute('/rockets/[id]')
  const store = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)
  let controller: AbortController | null = null

  async function load () {
    const id = String(route.params.id)
    status.value = 'loading'
    error.value = null

    // Rocket buatan user hanya ada di store (tidak ada di API)
    const local = store.findLocal(id)
    if (local) {
      rocket.value = local
      status.value = 'success'
      return
    }

    controller?.abort()
    controller = new AbortController()
    try {
      rocket.value = await fetchRocketById(id, controller.signal)
      status.value = 'success'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      error.value = e instanceof Error ? e.message : 'Terjadi kesalahan'
      status.value = 'error'
    }
  }

  // Lifecycle: fetch saat mount, batalkan request saat halaman ditinggalkan
  onMounted(load)
  onBeforeUnmount(() => controller?.abort())
</script>