<template>
  <v-container>
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      :to="{ name: '/' }"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <LoadingState
      v-if="status === 'idle' || status === 'loading'"
      message="Loading rocket details…"
    />

    <ErrorState
      v-else-if="status === 'error' && error"
      :message="error.message"
      :retryable="error.retryable"
      title="Could not load this rocket"
      @retry="loadRocket"
    />

    <RocketDetail
      v-else-if="rocket"
      :rocket="rocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketsStore } from '@/stores/rockets'
  import type { RequestStatus } from '@/types/request'
  import type { Rocket } from '@/types/rocket'
  import { type AppError, toAppError } from '@/utils/errors'

  const route = useRoute('/rockets/[id]')
  const rocketsStore = useRocketsStore()

  // This request state is only used by this screen, so it stays local instead of in the store.
  const rocket = ref<Rocket | null>(null)
  const status = ref<RequestStatus>('idle')
  const error = ref<AppError | null>(null)

  async function loadRocket () {
    status.value = 'loading'
    error.value = null
    try {
      rocket.value = await rocketsStore.fetchRocketDetail(route.params.id)
      status.value = 'success'
    } catch (caught) {
      error.value = toAppError(caught)
      status.value = 'error'
    }
  }

  onMounted(loadRocket)
</script>
