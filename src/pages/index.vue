<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRocketsStore } from '@/store/rocket'

import RocketForm from '@/components/RocketForm.vue'
import RocketList from '@/components/RocketList.vue'
import RocketState from '@/components/RocketState.vue'

import type { Rocket } from '@/types/rocket'

const rocketStore = useRocketsStore()

const searchQuery = ref('')
const dropdownList = ref<Rocket[]>([]);

onMounted(() => {
  rocketStore.retrieveRockets()
})

const filteredRockets = computed(() => {
  if (!searchQuery.value) return rocketStore.items
  return rocketStore.items.filter((r: { name: string }) =>
    r.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const addRocketToList = (rocket: Rocket) => {
  rocketStore.prependRocket(rocket)
}
</script>

<template>
  <section class="container">
    <div class="d-flex flex-column gap-4">

      <RocketForm @add-rocket="addRocketToList" :drop-down-list="rocketStore.dropdownList" v-model="searchQuery" />

      <RocketState v-if="rocketStore.loading||rocketStore.fetchError" :loading="rocketStore.loading" :error="rocketStore.fetchError"
        @retry="rocketStore.retrieveRockets" />

      <RocketList v-if="!rocketStore.loading && !rocketStore.fetchError" :rockets="filteredRockets" />
    </div>

  </section>
</template>
