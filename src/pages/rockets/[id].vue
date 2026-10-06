<template>
  <v-app-bar
    elevation="0"
  >
    <v-btn
      aria-label="Back to rocket catalogue"
      icon="mdi-arrow-left"
      min-height="44"
      min-width="44"
      to="/"
    />
    <v-app-bar-title>Rocket details</v-app-bar-title>
  </v-app-bar>

  <v-container class="page-shell">
    <AppFeedback
      v-if="detail.status === 'loading' || detail.status === 'idle'"
      message="Retrieving this rocket's information."
      state="loading"
      title="Loading rocket details"
    />
    <AppFeedback
      v-else-if="detail.status === 'error'"
      :message="detail.errorMessage || 'This rocket could not be found.'"
      :retryable="!rocketId.startsWith('local-')"
      state="error"
      title="Rocket details are unavailable"
      @retry="loadDetail"
    />
    <article
      v-else-if="detail.rocket"
      class="detail-layout"
    >
      <div class="detail-image">
        <v-img
          v-if="detail.rocket.imageUrl && !imageFailed"
          :alt="`${detail.rocket.name} rocket`"
          cover
          :src="detail.rocket.imageUrl"
          @error="imageFailed = true"
        />
        <div
          v-else
          class="detail-image__fallback"
          role="img"
          :aria-label="`No image available for ${detail.rocket.name}`"
        >
          <v-icon
            icon="mdi-image-off-outline"
            size="48"
          />
          <span>Image unavailable</span>
        </div>
      </div>
      <div>
        <p class="eyebrow">
          {{ detail.rocket.source === 'local' ? 'Session rocket' : 'Launch Library 2 record' }}
        </p>
        <h1>{{ detail.rocket.name }}</h1>
        <p class="detail-description">
          {{ detail.rocket.description }}
        </p>
        <dl class="detail-facts">
          <div><dt>Cost per launch</dt><dd>{{ detail.rocket.launchCost || 'Not available' }}</dd></div>
          <div><dt>Country</dt><dd>{{ detail.rocket.country || 'Not available' }}</dd></div>
          <div><dt>First flight</dt><dd>{{ detail.rocket.firstFlight || 'Not available' }}</dd></div>
        </dl>
      </div>
    </article>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppFeedback from '@/components/AppFeedback.vue'
import { useRocketStore } from '@/stores/rockets'

const route = useRoute()
const store = useRocketStore()
const imageFailed = ref(false)
const rocketId = computed(() => {
  const { id } = route.params as { id?: string | string[] }
  return Array.isArray(id) ? id[0] || '' : id || ''
})
const detail = computed(() => store.detailFor(rocketId.value))

function loadDetail () {
  imageFailed.value = false
  void store.loadRocket(rocketId.value)
}

onMounted(loadDetail)
watch(rocketId, loadDetail)
</script>

<style scoped>
.page-shell { padding-bottom: 48px; padding-top: 48px; }
.detail-layout { display: grid; gap: clamp(28px, 5vw, 64px); grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.detail-image { aspect-ratio: 4 / 3; overflow: hidden; }
.detail-image__fallback { align-items: center; color: #52616b; display: flex; flex-direction: column; gap: 8px; height: 100%; justify-content: center; border: 1px solid #ddd; }
.eyebrow { color: #0a55c7; font-size: 0.875rem; font-weight: 700; margin: 0 0 8px; }
h1 { color: #172033; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1.08; margin: 0; }
.detail-description { color: #39465a; font-size: 1.0625rem; line-height: 1.7; margin: 20px 0 32px; }
.detail-facts { display: grid; gap: 0; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0; }
.detail-facts div { border-top: 1px solid #c8d1dc; padding: 16px 12px 0 0; }
dt { color: #52616b; font-size: 0.875rem; }
dd { color: #172033; font-weight: 700; margin: 4px 0 0; }
@media (max-width: 900px) { .detail-layout { grid-template-columns: 1fr; } }
@media (max-width: 600px) {
  .page-shell { padding-top: 28px; }
  .detail-facts { grid-template-columns: 1fr; }
  .detail-facts div { padding: 14px 0 0; }
}
</style>
