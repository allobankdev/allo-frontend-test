<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRocketStore } from '../../stores/userRocketStore'
import { onMounted } from 'vue'

const router = useRouter()
const rocketStore = useRocketStore()

onMounted(async () => {
  await rocketStore.fetchRockets()
})
</script>

<template>
  <LaunchAdd 
    :show="true" 
    @close="router.push('/')"
  />
</template>

