<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <v-row v-if="rocket">
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <RocketImage
            :alt="rocket.name"
            :src="rocket.imageUrl"
          />
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <h1 class="text-h4 mb-2">
          {{ rocket.name }}
        </h1>
        <p class="mb-6">
          {{ formatText(rocket.description, 'No description available.') }}
        </p>
        <v-list lines="two">
          <v-list-item
            :subtitle="formatCost(rocket.launchCost)"
            title="Cost per launch"
          />
          <v-list-item
            :subtitle="formatText(rocket.countryCode)"
            title="Country"
          />
          <v-list-item
            :subtitle="formatDate(rocket.maidenFlight)"
            title="First flight"
          />
        </v-list>
      </v-col>
    </v-row>

    <StatusView
      v-else-if="isLocal"
      message="This rocket no longer exists (added rockets are cleared on refresh)."
      status="empty"
    />
    <StatusView
      v-else-if="detailStatus === 'failed'"
      :message="detailError"
      status="failed"
      @retry="load"
    />
    <StatusView
      v-else
      status="loading"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rocket'
  import { formatCost, formatDate, formatText } from '@/utils/format'

  const route = useRoute()
  const store = useRocketStore()
  const { detailError, detailStatus } = storeToRefs(store)

  const id = computed(() => String(route.params.id))
  const rocket = computed(() => store.getById(id.value))
  const isLocal = computed(() => store.isLocalId(id.value))

  // Jika rocket belum ada di store (buka URL langsung / refresh), ambil dari endpoint single rocket.
  // Rocket lokal tidak ada di API sehingga tidak di-fetch.
  function load () {
    if (!rocket.value && !isLocal.value) store.loadRocketById(id.value)
  }

  // Lifecycle: mounted + reaksi saat parameter id berubah.
  onMounted(load)
  watch(id, load)
</script>
