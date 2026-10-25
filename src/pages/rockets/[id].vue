<template>
  <div>
    <!-- UI State: Detail Loading -->
    <StateLoading
      v-if="store.detailLoading"
      title="Retrieving Rocket Details..."
      message="Fetching launch specifications and vehicle records"
    />

    <!-- UI State: Error / Not Found with Retry -->
    <StateError
      v-else-if="store.error || !store.selectedRocket"
      :message="store.error || 'The requested rocket could not be located in the library.'"
      title="Rocket Not Found"
      @retry="loadRocket"
    />

    <!-- UI State: Success Detail Display -->
    <RocketDetailCard
      v-else
      :rocket="store.selectedRocket"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import StateLoading from '@/components/common/StateLoading.vue'
import StateError from '@/components/common/StateError.vue'
import RocketDetailCard from '@/components/rockets/RocketDetailCard.vue'
import { useRocketStore } from '@/stores/useRocketStore'

const route = useRoute()
const store = useRocketStore()

const rocketId = computed(() => {
  const param = route.params.id
  return Array.isArray(param) ? param[0] : param
})

async function loadRocket () {
  if (rocketId.value) {
    await store.fetchRocketDetail(rocketId.value)
  }
}

// Lifecycle: Fetch rocket detail on mount
onMounted(() => {
  loadRocket()
})

// React to route parameter changes (e.g. navigation between rockets)
watch(rocketId, (newId) => {
  if (newId) {
    loadRocket()
  }
})
</script>
