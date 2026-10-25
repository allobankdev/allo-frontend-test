<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { mdiArrowLeft, mdiRocketLaunchOutline } from '@/constants/icons'
  import { HttpError } from '@/services/httpClient'
  import { getRocketById, toRocket } from '@/services/rocketApi'
  import { useRocketStore } from '@/stores/useRocketStore'
  import type { Rocket } from '@/types/rocket'

  const route = useRoute()
  const rocketStore = useRocketStore()

  const status = ref<'loading' | 'error' | 'success'>('loading')
  const errorMessage = ref<string | null>(null)
  const rocket = ref<Rocket | null>(null)

  // Guards against a race condition: if route.params.id changes again before the
  // previous resolve() finishes (e.g. navigating quickly between two detail pages),
  // the slower response must not overwrite the result of the newer resolve() call.
  let resolveToken = 0

  async function resolve () {
    const token = ++resolveToken
    const id = String(route.params.id)
    status.value = 'loading'
    errorMessage.value = null
    rocket.value = null

    // Landing directly on the detail URL (refresh/deep link) — the store is still empty, fetch first.
    if (rocketStore.status === 'idle') {
      await rocketStore.fetchRockets()
    }
    if (token !== resolveToken) return

    if (rocketStore.status === 'error') {
      status.value = 'error'
      errorMessage.value = rocketStore.errorMessage
      return
    }

    const found = rocketStore.rocketById(id)
    if (found) {
      rocket.value = found
      status.value = 'success'
      return
    }

    // Locally-added rockets only exist in the store's memory — if not found there,
    // don't fall back to fetching by id from the API; treat it as not found.
    if (!id.startsWith('local-')) {
      try {
        const dto = await getRocketById(id)
        if (token !== resolveToken) return
        rocket.value = toRocket(dto)
      } catch (error) {
        if (token !== resolveToken) return
        // A 404 means the rocket genuinely doesn't exist, not a network failure — render it
        // as "not found" (rocket.value stays null) instead of the error+retry state.
        if (!(error instanceof HttpError && error.status === 404)) {
          status.value = 'error'
          errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat detail rocket'
          return
        }
      }
    }

    status.value = 'success'
  }

  watch(() => route.params.id, resolve, { immediate: true })
</script>

<template>
  <v-container
    class="py-8"
    max-width="900"
  >
    <v-btn
      class="mb-6"
      :prepend-icon="mdiArrowLeft"
      to="/"
      variant="text"
    >
      Kembali ke daftar
    </v-btn>

    <AsyncState
      :error-message="errorMessage"
      :on-retry="resolve"
      :status="status"
    >
      <div
        v-if="!rocket"
        class="d-flex flex-column align-center justify-center text-center py-16"
      >
        <v-icon
          class="mb-4 text-medium-emphasis"
          :icon="mdiRocketLaunchOutline"
          size="56"
        />
        <p class="text-body-1 text-medium-emphasis">
          Rocket tidak ditemukan.
        </p>
      </div>
      <RocketDetailContent
        v-else
        :rocket="rocket"
      />
    </AsyncState>
  </v-container>
</template>
