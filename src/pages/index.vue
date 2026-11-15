<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { rocketStore } from '@/stores/rockets'
import RocketCard from '@/components/RocketCard.vue'
import RequestState from '@/components/RequestState.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const { state, rockets } = rocketStore
const notice = ref('')
const search = computed({ get: () => state.search, set: rocketStore.setSearch })
const family = computed({ get: () => state.family, set: rocketStore.setFamily })
const families = computed(() => [...new Set(rockets.value.map(rocket => rocket.family).filter(Boolean))].sort())
const filtered = computed(() => rockets.value.filter(rocket => {
  const query = state.search.trim().toLowerCase()
  return rocket.name.toLowerCase().includes(query)
    && (!state.family || rocket.family === state.family)
}))
onMounted(() => { void rocketStore.loadList() })
function resetFilters() {
  rocketStore.setSearch('')
  rocketStore.setFamily('')
}
</script>

<template>
  <section class="catalog-intro">
    <div>
      <p class="eyebrow">
        THE SPACEX CATALOG
      </p>
      <h1>Rockets, up close<span>.</span></h1>
      <p class="intro-description">
        Explore the vehicles taking us beyond Earth.
      </p>
    </div>
    <AddRocketDialog @added="name => { notice = name + ' was added to your catalog.' }" />
  </section>

  <div class="catalog-toolbar">
    <div class="search-field">
      <label for="rocket-search">Search rockets</label>
      <input
        id="rocket-search"
        v-model="search"
        type="search"
        placeholder="Search by rocket name"
      >
    </div>
    <div class="family-field">
      <label for="rocket-family">Rocket family</label>
      <select
        id="rocket-family"
        v-model="family"
      >
        <option value="">
          All families
        </option>
        <option
          v-for="item in families"
          :key="item!"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
    </div>
    <p
      v-if="state.status === 'success'"
      class="result-count"
      role="status"
    >
      {{ filtered.length }} {{ filtered.length === 1 ? 'rocket' : 'rockets' }}
    </p>
  </div>

  <p
    v-if="notice"
    class="success-notice"
    role="status"
  >
    {{ notice }}
  </p>
  <RequestState
    v-if="state.status === 'loading' || state.status === 'idle'"
    loading
  />
  <RequestState
    v-else-if="state.status === 'error'"
    :message="state.error"
    @retry="rocketStore.loadList()"
  />

  <div
    v-if="filtered.length"
    class="rocket-grid"
  >
    <RocketCard
      v-for="rocket in filtered"
      :key="rocket.id"
      :rocket="rocket"
    />
  </div>
  <div
    v-else-if="state.status === 'success'"
    class="request-state"
  >
    <h2>{{ search || family ? 'No matching rockets' : 'The catalog is empty' }}</h2>
    <p>{{ search || family ? 'Try a different name or rocket family.' : 'You can add a rocket with the button above.' }}</p>
    <v-btn
      v-if="search || family"
      variant="outlined"
      @click="resetFilters"
    >
      Clear filters
    </v-btn>
  </div>
</template>
