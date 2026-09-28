<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import RocketCard from '../components/RocketCard.vue'
import RequestState from '../components/RequestState.vue'
import AddRocketForm from '../components/AddRocketForm.vue'
import { rocketStore } from '../stores/rockets'
import type { NewRocket } from '../types/rocket'

const { state, filteredRockets, rockets } = rocketStore
const filter = computed({ get: () => state.filter, set: rocketStore.setFilter })
const showForm = ref(false)
const addButton = ref<HTMLButtonElement | null>(null)
const message = ref('')
onMounted(() => { void rocketStore.loadList() })

async function closeForm() {
  showForm.value = false
  await nextTick()
  addButton.value?.focus()
}

function addRocket(input: NewRocket) {
  const rocket = rocketStore.addRocket(input)
  message.value = `${rocket.name} berhasil ditambahkan.`
  void closeForm()
}
</script>

<template>
  <section aria-labelledby="page-title">
    <div class="page-heading">
      <div>
        <p class="eyebrow">SpaceX</p>
        <h1 id="page-title">Daftar roket</h1>
        <p class="muted">Temukan roket dan lihat informasi peluncurannya.</p>
      </div>
      <button
        ref="addButton"
        class="button"
        type="button"
        :aria-expanded="showForm"
        aria-controls="add-rocket"
        @click="showForm ? closeForm() : (showForm = true)"
      >Tambah roket</button>
    </div>

    <div id="add-rocket">
      <AddRocketForm v-if="showForm" @add="addRocket" @cancel="closeForm" />
    </div>
    <p class="success-message" role="status">{{ message }}</p>

    <div class="list-toolbar">
      <label class="field search-field">
        <span>Cari berdasarkan nama</span>
        <input v-model="filter" type="search" placeholder="Cari nama roket…">
      </label>
      <p v-if="state.status === 'success' || rockets.length" class="muted" role="status">
        {{ filteredRockets.length }} dari {{ rockets.length }} roket
      </p>
    </div>

    <RequestState
      :loading="state.status === 'loading'"
      :error="state.error"
      @retry="rocketStore.loadList(true)"
    />

    <div v-if="filteredRockets.length" class="rocket-grid">
      <RocketCard v-for="rocket in filteredRockets" :key="rocket.id" :rocket="rocket" />
    </div>
    <div v-else-if="state.status === 'success' || rockets.length" class="request-state">
      <h2>{{ filter.trim() ? 'Tidak ada roket yang cocok' : 'Belum ada roket' }}</h2>
      <p>{{ filter.trim() ? 'Coba nama lain atau kosongkan pencarian.' : 'Tambahkan roket melalui tombol di atas.' }}</p>
    </div>
  </section>
</template>
