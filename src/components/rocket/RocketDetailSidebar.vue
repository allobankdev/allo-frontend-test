<template>
  <v-navigation-drawer
    class="rocket-detail-sidebar"
    location="end"
    :model-value="open"
    temporary
    width="400"
    @update:model-value="onDrawerUpdate"
  >
    <div class="d-flex align-center justify-space-between pa-4 border-b">
      <span class="text-h6">Rocket Details</span>
      <v-btn
        aria-label="Close"
        icon="mdi-close"
        variant="text"
        @click="close"
      />
    </div>

    <div class="pa-4">
      <LoadingState
        v-if="loading"
        message="Loading rocket details..."
      />

      <ErrorState
        v-else-if="error"
        :message="error"
        @retry="loadRocket"
      />

      <template v-else-if="rocket">
        <v-card
          class="mb-4"
          variant="outlined"
        >
          <RocketImage
            :alt="formatText(rocket.full_name, 'Rocket')"
            :src="rocket.image_url"
          />
        </v-card>

        <h2 class="text-h5 font-weight-bold mb-3">
          {{ formatText(rocket.full_name, 'Unnamed Rocket') }}
        </h2>

        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ formatText(rocket.description, 'No description available.') }}
        </p>

        <v-list
          class="bg-transparent pa-0"
          density="compact"
          lines="two"
        >
          <v-list-item
            prepend-icon="mdi-cash"
            subtitle="Cost per Launch"
            :title="formatLaunchCost(rocket.launch_cost)"
          />
          <v-list-item
            prepend-icon="mdi-earth"
            subtitle="Country"
            :title="formatText(rocket.manufacturer?.country_code)"
          />
          <v-list-item
            prepend-icon="mdi-calendar"
            subtitle="First Flight"
            :title="formatDate(rocket.maiden_flight)"
          />
        </v-list>
      </template>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import ErrorState from '@/components/common/ErrorState.vue'
  import LoadingState from '@/components/common/LoadingState.vue'
  import RocketImage from '@/components/rocket/RocketImage.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import type { Rocket } from '@/types/rocket'
  import { formatDate, formatLaunchCost, formatText } from '@/utils/formatters'

  const props = defineProps<{
    rocketId: number | null
    open: boolean
  }>()

  const emit = defineEmits<{
    close: []
  }>()

  const { getRocketById } = useRocketsStore()

  const rocket = ref<Rocket | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadRocket (): Promise<void> {
    if (props.rocketId === null) return

    loading.value = true
    error.value = null
    rocket.value = null

    try {
      rocket.value = await getRocketById(props.rocketId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  function close (): void {
    emit('close')
  }

  function onDrawerUpdate (value: boolean): void {
    if (!value) close()
  }

  watch(() => props.rocketId, (id) => {
    if (id !== null) {
      loadRocket()
    } else {
      rocket.value = null
      error.value = null
      loading.value = false
    }
  }, { immediate: true })
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.rocket-detail-sidebar :deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}
</style>
