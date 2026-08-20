<script setup lang="ts">

import { onMounted, onUnmounted, watch } from 'vue'

const store = { loadRockets: () => {}, selectedRocket: null }

onMounted(() => {
  console.log('Rocket page mounted')
  store.loadRockets()
})

onUnmounted(() => {
  console.log('Rocket page destroyed')
})

watch(
  () => store.selectedRocket,
  (newRocket) => {
    console.log('Selected Rocket:', newRocket)
  }
)

</script>

<template>
  <div>
    <!-- UI Anda -->
  </div>
</template>