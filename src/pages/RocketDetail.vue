<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { rocketStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'
import { flightDate, launchCost } from '@/utils/format'
import RocketImage from '@/components/RocketImage.vue'
import RequestState from '@/components/RequestState.vue'

const route = useRoute()
const rocket = ref<Rocket>()
const loading = ref(false)
const error = ref('')
let requestVersion = 0

async function load() {
  const version = ++requestVersion
  loading.value = true
  rocket.value = undefined
  error.value = ''
  try {
    const result = await rocketStore.getRocket(String(route.params.id))
    if (version === requestVersion) rocket.value = result
  } catch (cause) {
    if (version === requestVersion) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load this rocket.'
    }
  } finally {
    if (version === requestVersion) loading.value = false
  }
}

watch(() => route.params.id, load, { immediate: true })
</script>

<template>
  <router-link
    to="/"
    class="back-link"
  >
    <span aria-hidden="true">←</span> Back to rockets
  </router-link>
  <RequestState
    v-if="loading"
    loading
  />
  <RequestState
    v-else-if="error"
    :message="error"
    @retry="load"
  />
  <article
    v-else-if="rocket"
    class="rocket-detail"
  >
    <RocketImage
      :src="rocket.imageUrl"
      :name="rocket.name"
      eager
    />
    <div class="detail-content">
      <p class="eyebrow">
        {{ rocket.local ? 'ADDED BY YOU' : 'ROCKET PROFILE' }}
      </p>
      <h1>{{ rocket.name }}</h1>
      <p class="detail-description">
        {{ rocket.description }}
      </p>
      <dl class="rocket-facts">
        <div>
          <dt>Cost per launch</dt>
          <dd>{{ launchCost(rocket.cost) }}</dd>
        </div>
        <div>
          <dt>Country</dt>
          <dd>{{ rocket.country || 'Not available' }}</dd>
        </div>
        <div>
          <dt>First flight</dt>
          <dd>{{ flightDate(rocket.firstFlight) }}</dd>
        </div>
      </dl>
      <p
        v-if="rocket.local"
        class="source-note"
      >
        Saved for this session. Refreshing the page removes this entry.
      </p>
      <p
        v-else
        class="source-note"
      >
        Rocket data provided by The Space Devs.
      </p>
    </div>
  </article>
</template>
