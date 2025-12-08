<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '../../stores/userRocketStore'
import { onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

onMounted(async () => {
  await rocketStore.fetchRockets()
})
</script>

<template>
  <LaunchModal 
    :show="true" 
    :launch="rocketStore.rockets.find(r => r.id === route.params.id) || null" 
    @close="router.push('/')"
  />
</template>

