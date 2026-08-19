<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RocketCard from '@/components/RocketCard.vue'
import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()
const dialogOpen = ref(false)
const query = ref('')
const filteredRockets = computed(() => {
  const search = query.value.trim().toLocaleLowerCase()
  if (!search) return store.rockets
  return store.rockets.filter(rocket => `${rocket.name} ${rocket.description ?? ''}`.toLocaleLowerCase().includes(search))
})
onMounted(() => store.fetchRockets())
</script>

<template>
  <header class="hero">
    <v-container class="py-12 py-md-16">
      <p class="eyebrow mb-4">
        ALL OTHER BOUNDARIES ARE TEMPORARY
      </p>
      <h1 class="hero-title">
        Rocket explorer
      </h1>
      <p class="hero-copy mt-4">
        Explore SpaceX launch vehicles, from early experiments to reusable orbital workhorses.
      </p>
      <div class="controls mt-8 d-flex ga-3 flex-wrap">
        <v-text-field
          v-model="query"
          aria-label="Filter rockets"
          bg-color="white"
          clearable
          hide-details
          prepend-inner-icon="mdi-magnify"
          placeholder="Filter by name or description"
          rounded="lg"
          variant="outlined"
        />
        <v-btn
          color="primary"
          height="56"
          prepend-icon="mdi-plus"
          rounded="lg"
          variant="flat"
          @click="dialogOpen = true"
        >
          Add rocket
        </v-btn>
      </div>
    </v-container>
  </header>

  <v-container class="py-10 py-md-12">
    <div class="d-flex align-end justify-space-between mb-7 flex-wrap ga-3">
      <div>
        <h2 class="text-h4 font-weight-bold">
          SpaceX fleet
        </h2><p class="text-medium-emphasis mt-1">
          {{ filteredRockets.length }} rockets shown
        </p>
      </div>
    </div>

    <v-row
      v-if="store.listStatus === 'loading'"
      aria-label="Loading rockets"
    >
      <v-col
        v-for="item in 6"
        :key="item"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-skeleton-loader
          class="rounded-lg"
          type="image, article"
        />
      </v-col>
    </v-row>
    <v-alert
      v-else-if="store.listStatus === 'error'"
      color="error"
      icon="mdi-alert-circle-outline"
      title="Rockets could not be loaded"
      variant="tonal"
    >
      {{ store.listError }}
      <template #append>
        <v-btn
          variant="text"
          @click="store.retryFetch"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>
    <v-empty-state
      v-else-if="store.listStatus === 'success' && store.rockets.length === 0"
      headline="No rockets available"
      icon="mdi-rocket-outline"
      text="The service returned an empty fleet. Try again later."
    />
    <v-empty-state
      v-else-if="filteredRockets.length === 0"
      headline="No rockets found"
      icon="mdi-magnify-close"
      text="Try another filter or add a local rocket."
    />
    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>
  </v-container>
  <AddRocketDialog v-model="dialogOpen" />
</template>

<style scoped>
.hero { background: #152126; color: #f7faf9; border-bottom: 5px solid rgb(var(--v-theme-primary)); }
.eyebrow { color: #ffb19f; font-size: .75rem; font-weight: 800; letter-spacing: .17em; }
.hero-title { font-size: clamp(3rem, 8vw, 6.5rem); line-height: .9; letter-spacing: -.065em; }
.hero-copy { color: #c7d0d2; font-size: 1.12rem; line-height: 1.7; max-width: 650px; }
.controls { max-width: 800px; }.controls .v-text-field { min-width: min(420px, 100%); }
@media (max-width: 600px) { .controls > * { width: 100%; } }
</style>
