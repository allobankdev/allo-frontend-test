<template>
  <div class="detail-page">
    <SiteHeader back-link />

    <main class="detail-wrap">
      <StateMessage
        v-if="loading"
        loading
        title="Loading launcher"
        message="Retrieving mission data..."
      />
      <StateMessage
        v-else-if="error"
        title="We lost the signal"
        :message="error"
        @retry="loadRocket"
      />
      <div
        v-else-if="rocket"
        class="detail-layout"
      >
        <section
          class="detail-visual"
          :class="`tone-${visualTone}`"
        >
          <RocketArtwork />
          <img
            v-if="rocket.image_url && imageAvailable"
            class="rocket-photo"
            :src="rocket.image_url"
            :alt="rocket.full_name || 'Rocket'"
            @error="imageAvailable = false"
          >
          <span class="visual-label">
            Launcher profile · {{ country }}<template v-if="!rocket.image_url || !imageAvailable"> · Illustration</template>
          </span>
        </section>

        <section
          class="detail-copy"
          aria-labelledby="rocket-name"
        >
          <p class="eyebrow">
            <span>✳</span> SpaceX launcher
          </p>
          <p class="detail-kicker">
            Mission vehicle / {{ String(rocket.id).slice(0, 8).toUpperCase() }}
          </p>
          <h1 id="rocket-name">
            {{ rocket.full_name || 'Unnamed launcher' }}
          </h1>
          <p class="detail-description">
            {{ rocket.description || 'No description is available for this launcher yet. Mission information will be updated when new data becomes available.' }}
          </p>

          <dl class="spec-grid">
            <div class="spec">
              <dt>Launch cost</dt>
              <dd>{{ formatCost(rocket.launch_cost) }}</dd>
            </div>
            <div class="spec">
              <dt>Country</dt>
              <dd>{{ country }}</dd>
            </div>
            <div class="spec">
              <dt>First flight</dt>
              <dd>{{ formatDate(rocket.maiden_flight) }}</dd>
            </div>
            <div class="spec">
              <dt>Manufacturer</dt>
              <dd>{{ rocket.manufacturer?.name || (rocket.isLocal ? 'Added locally' : 'SpaceX') }}</dd>
            </div>
          </dl>

          <RouterLink
            to="/"
            class="back-button"
          >
            ← &nbsp;Back to all launchers
          </RouterLink>
        </section>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import StateMessage from '@/components/StateMessage.vue'
import RocketArtwork from '@/components/RocketArtwork.vue'
import { getRocket } from '@/services/rocketApi'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'
import { formatCost, formatDate } from '@/utils/rocket'

const route = useRoute()
const { rockets, state, fetchRockets } = useRockets()
const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref('')
const imageAvailable = ref(true)
let requestVersion = 0
const country = computed(() => rocket.value?.manufacturer?.country_code || 'Not available')
const visualTone = computed(() => {
  const id = String(rocket.value?.id || '')
  const numericId = Number(id)
  return Number.isFinite(numericId) ? numericId % 4 : id.length % 4
})

async function loadRocket() {
  const currentRequest = ++requestVersion
  const id = String(route.params.id)
  loading.value = true
  error.value = ''
  imageAvailable.value = true

  const localRocket = rockets.value.find((item) => String(item.id) === id)
  if (localRocket) {
    rocket.value = localRocket
    loading.value = false
    return
  }

  try {
    if (!state.loaded) await fetchRockets()
    if (currentRequest !== requestVersion) return

    const listRocket = rockets.value.find((item) => String(item.id) === id)
    if (listRocket) {
      rocket.value = listRocket
      return
    }

    if (id.startsWith('local-')) {
      throw new Error('This local rocket is no longer available after the page was refreshed.')
    }

    const requestedRocket = await getRocket(id)
    if (currentRequest === requestVersion) rocket.value = requestedRocket
  } catch (reason) {
    if (currentRequest === requestVersion) {
      error.value = reason instanceof Error ? reason.message : 'Unable to load launcher details.'
    }
  } finally {
    if (currentRequest === requestVersion) loading.value = false
  }
}

onMounted(loadRocket)
watch(() => route.params.id, loadRocket)
</script>
