<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.back()">
      Back
    </v-btn>

    <div v-if="store.status === 'loading'" class="mt-4">
      <v-progress-circular indeterminate color="primary" />
      <span class="ml-2">Loading rockets…</span>
    </div>

    <template v-else-if="rocket">
      <v-img
        v-if="rocket.imageUrl"
        :src="rocket.imageUrl"
        max-height="240"
        contain
        class="mt-4"
      />
      <v-img
        v-else
        max-height="240"
        contain
        color="surface-variant"
        class="mt-4"
      >
        <div class="d-flex align-center justify-center">
          <v-icon size="72" icon="mdi-rocket-outline" />
        </div>
      </v-img>

      <h1 class="text-h4 mt-4">{{ rocket.fullName }}</h1>
      <p class="text-body-1">{{ rocket.description }}</p>

      <v-list>
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi-currency-usd" />
          </template>
          <v-list-item-title>Cost per launch</v-list-item-title>
          <v-list-item-subtitle>{{ costPerLaunch }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi-earth" />
          </template>
          <v-list-item-title>Country</v-list-item-title>
          <v-list-item-subtitle>{{ rocket.country || '—' }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <template #prepend>
            <v-icon icon="mdi-rocket-launch-outline" />
          </template>
          <v-list-item-title>First flight</v-list-item-title>
          <v-list-item-subtitle>{{ rocket.firstFlight || '—' }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </template>

    <v-alert v-else type="warning" title="Rocket not found" class="mt-4">
      This rocket does not exist in the running app.
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '@/store/rocketStore'

  const route = useRoute()
  const store = useRocketStore()

  onMounted(() => {
    store.fetchRockets()
  })

  const params = route.params as { id?: string }
  const id = Number(params.id)
  const rocket = computed(() =>
    store.rockets.find((r) => r.id === id) ?? store.localRockets.find((r) => r.id === id),
  )

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
  const costPerLaunch = computed(() =>
    rocket.value?.costPerLaunch != null ? formatter.format(rocket.value.costPerLaunch) : '—',
  )
</script>