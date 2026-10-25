<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import RocketImage from '@/components/RocketImage.vue'
import { useRocketStore } from '@/stores/rockets'
import { fallback, formatFirstFlight, formatLaunchCost } from '@/utils/formatters'

const route = useRoute()
const store = useRocketStore()
const id = computed(() => String(route.params.id))
const rocket = computed(() => store.byId(id.value))

async function load (force = false) { await store.fetchRocket(id.value, force) }
watch(id, () => load(), { immediate: true })
</script>

<template>
  <v-container class="py-6 py-md-10">
    <v-btn
      class="mb-7"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>
    <v-skeleton-loader
      v-if="store.detailStatus === 'loading' && !rocket"
      class="rounded-xl"
      type="image, heading, paragraph, paragraph"
    />
    <v-alert
      v-else-if="store.detailStatus === 'error' && !rocket"
      color="error"
      icon="mdi-alert-circle-outline"
      title="Rocket unavailable"
      variant="tonal"
    >
      {{ store.detailError }}
      <template #append>
        <v-btn
          v-if="!id.startsWith('local-')"
          variant="text"
          @click="load(true)"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>
    <v-empty-state
      v-else-if="!rocket"
      headline="Rocket not found"
      icon="mdi-rocket-outline"
      text="This rocket is unavailable. Local rockets disappear after a full browser refresh."
    >
      <template #actions>
        <v-btn
          color="primary"
          to="/"
        >
          Return to list
        </v-btn>
      </template>
    </v-empty-state>
    <v-row
      v-else
      align="start"
    >
      <v-col
        cols="12"
        md="6"
      >
        <RocketImage
          class="detail-image"
          :src="rocket.imageUrl"
          :alt="rocket.name"
          height="clamp(340px, 58vw, 620px)"
        />
      </v-col>
      <v-col
        class="pl-md-10"
        cols="12"
        md="6"
      >
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          class="mb-5"
        >
          Local rocket
        </v-chip>
        <p class="eyebrow">
          VEHICLE PROFILE
        </p>
        <h1 class="detail-title mt-2">
          {{ rocket.name }}
        </h1>
        <p class="description mt-6">
          {{ rocket.description || 'No description available.' }}
        </p>
        <dl class="facts mt-8">
          <div><dt>Cost per launch</dt><dd>{{ formatLaunchCost(rocket.launchCost) }}</dd></div>
          <div><dt>Country</dt><dd>{{ fallback(rocket.countryCode) }}</dd></div>
          <div><dt>First flight</dt><dd>{{ formatFirstFlight(rocket.maidenFlight) }}</dd></div>
        </dl>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.detail-image { border-radius: 20px; overflow: hidden; border: 1px solid #dce2e5; }
.eyebrow { color: rgb(var(--v-theme-primary)); font-size: .75rem; font-weight: 800; letter-spacing: .16em; }
.detail-title { font-size: clamp(2.7rem, 7vw, 5.8rem); line-height: .95; letter-spacing: -.06em; overflow-wrap: anywhere; }
.description { color: #526066; font-size: 1.08rem; line-height: 1.75; }
.facts { border-top: 1px solid #cbd3d6; }.facts div { display: grid; grid-template-columns: 1fr 1.5fr; gap: 18px; padding: 20px 0; border-bottom: 1px solid #cbd3d6; }.facts dt { color: #6a767b; }.facts dd { font-weight: 700; margin: 0; }
@media (max-width: 600px) { .facts div { grid-template-columns: 1fr; gap: 4px; } }
</style>
