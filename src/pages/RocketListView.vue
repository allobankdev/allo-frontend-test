<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRocketStore } from '../stores/rocketStore'
import { STATUS } from '../types/status'
import type { NewRocketInput } from '../types/rocket'
import StatusView from '../components/StatusView.vue'
import RocketCard from '../components/RocketCard.vue'
import RocketFilter from '../components/RocketFilter.vue'
import AddRocketForm from '../components/AddRocketForm.vue'

const store = useRocketStore()
const { listStatus, listError, query, filteredRockets } = storeToRefs(store)
const showForm = ref(false)

onMounted(() => {
  if (listStatus.value === STATUS.IDLE) store.loadRockets()
})

function onAdd(rocket: NewRocketInput): void {
  store.addRocket(rocket)
  query.value = ''
  showForm.value = false
}
</script>

<template>
  <section>
    <div class="toolbar">
      <h1>Rockets</h1>
      <button type="button" class="btn" :aria-expanded="showForm" @click="showForm = !showForm">
        {{ showForm ? 'Close form' : 'Add rocket' }}
      </button>
    </div>

    <AddRocketForm v-if="showForm" @submit="onAdd" @cancel="showForm = false" />

    <StatusView :status="listStatus" :error="listError" @retry="store.loadRockets">
      <RocketFilter v-model="query" />
      <p v-if="!filteredRockets.length" class="state">No rockets match "{{ query }}".</p>
      <div v-else class="grid">
        <RocketCard v-for="rocket in filteredRockets" :key="rocket.id" :rocket="rocket" />
      </div>
    </StatusView>
  </section>
</template>
