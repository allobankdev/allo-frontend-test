<template>
  <!-- Simple redirect to the rocket list screen -->
  <v-container class="py-10">
    <UiLoading />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UiLoading from '@/components/UiLoading.vue'

const router = useRouter()

onMounted(() => {
  router.replace({ path: '/rockets' })
})
</script>
