<template>
  <v-container
    class="py-6"
    max-width="900"
  >
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <!-- Same StateView as the list page: loading / error+retry / content. -->
    <StateView
      :error="store.detailError"
      loading-text="Loading rocket…"
      :status="store.detailStatus"
      @retry="load"
    >
      <v-card v-if="rocket">
        <RocketImage
          :alt="rocket.name"
          :aspect-ratio="21 / 9"
          :src="rocket.imageUrl"
        />
        <v-card-title class="text-h5 pt-4">
          {{ rocket.name }}
        </v-card-title>
        <v-card-text>
          <p class="mb-6">
            {{ formatText(rocket.description, 'No description available.') }}
          </p>
          <!-- Cost, country and first flight are rendered from the `facts` list. -->
          <v-list
            density="comfortable"
            lines="one"
          >
            <v-list-item
              v-for="item in facts"
              :key="item.label"
              :prepend-icon="item.icon"
              :subtitle="item.label"
              :title="item.value"
            />
          </v-list>
        </v-card-text>
      </v-card>
    </StateView>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '../../stores/rocketStore'
  import { formatCost, formatDate, formatText } from '../../utils/format'

  const route = useRoute()
  const store = useRocketStore()
  // Controller of the current request; replaced on every (re)load.
  let controller: AbortController | null = null

  // Route params are always strings, which matches Rocket.id.
  const rocketId = computed(() => String((route.params as { id: string }).id))
  const rocket = computed(() => store.detail)

  // The three facts required by the assignment, already formatted for display.
  const facts = computed(() => [
    { label: 'Cost per launch', value: formatCost(rocket.value?.launchCost ?? null), icon: 'mdi-cash' },
    { label: 'Country', value: formatText(rocket.value?.country ?? null), icon: 'mdi-flag-outline' },
    { label: 'First flight', value: formatDate(rocket.value?.firstFlight ?? null), icon: 'mdi-calendar' },
  ])

  function load () {
    // Cancel any request still running for a previous id before starting a new one.
    controller?.abort()
    controller = new AbortController()
    store.loadRocketDetail(rocketId.value, controller.signal)
  }

  // Lifecycle: load immediately and again whenever the route id changes;
  // abort the pending request when leaving the page.
  watch(rocketId, load, { immediate: true })
  onBeforeUnmount(() => controller?.abort())
</script>
