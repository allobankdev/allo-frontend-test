<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLaunchersStore } from '@/stores/launchers'
import StateBlock from '@/components/StateBlock.vue'

const route = useRoute()
const store = useLaunchersStore()

const id = computed(() => String(route.params.id))
const rocket = computed(() => store.byId(id.value))
const state = computed(() => store.detailState[id.value] ?? 'idle')
const error = computed(() => store.detailError[id.value])

store.loadOne(id.value)

function costLabel(v?: number) {
  if (v == null) return 'Unknown'
  return `$${v.toLocaleString('en-US')}`
}
function flightLabel(v?: string) {
  return v ?? 'Unknown'
}
function countryLabel(m?: { country_code?: string }) {
  return m?.country_code ?? 'Unknown'
}
</script>

<template>
  <v-container max-width="960">
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
    >
      Back to list
    </v-btn>

    <StateBlock
      v-if="!rocket"
      :state="state"
      :error="error"
      variant="block"
      @retry="store.loadOne(id)"
    />

    <article v-else>
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        :alt="rocket.full_name"
        max-height="420"
        cover
        class="rounded-lg"
      />
      <div
        v-else
        class="detail-placeholder rounded-lg d-flex align-center justify-center"
      >
        <v-icon
          size="96"
          icon="mdi-rocket-launch-outline"
        />
      </div>

      <h1 class="text-h4 font-weight-bold mt-6">
        {{ rocket.full_name }}
      </h1>

      <p class="text-body-1 mt-4 text-medium-emphasis">
        {{ rocket.description || 'No description available.' }}
      </p>

      <v-row class="mt-6">
        <v-col
          cols="12"
          sm="4"
        >
          <div class="text-caption text-medium-emphasis">
            Cost per launch
          </div>
          <div class="text-h6 mt-1">
            {{ costLabel(rocket.launch_cost) }}
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <div class="text-caption text-medium-emphasis">
            Country
          </div>
          <div class="text-h6 mt-1">
            {{ countryLabel(rocket.manufacturer) }}
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <div class="text-caption text-medium-emphasis">
            First flight
          </div>
          <div class="text-h6 mt-1">
            {{ flightLabel(rocket.maiden_flight) }}
          </div>
        </v-col>
      </v-row>
    </article>
  </v-container>
</template>

<style scoped>
.detail-placeholder {
  height: 420px;
  background: rgb(var(--v-theme-surface-variant));
}
</style>
