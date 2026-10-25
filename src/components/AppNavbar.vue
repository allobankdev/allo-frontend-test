<template>
  <v-app-bar flat border class="px-md-8 px-4 bg-surface" height="70">
    <router-link to="/" class="d-flex align-center text-decoration-none text-white">
      <v-avatar color="primary" class="mr-3" size="40">
        <v-icon icon="mdi-rocket-launch" color="black" />
      </v-avatar>
      <div>
        <div class="text-h6 font-weight-bold line-height-1 text-white">Allo SpaceX Rockets</div>
        <div class="text-caption text-medium-emphasis">Launch Library 2 Explorer</div>
      </div>
    </router-link>

    <v-spacer />

    <div class="d-flex align-center gap-3">
      <v-chip
        v-if="totalCount > 0"
        variant="tonal"
        color="primary"
        size="small"
        class="font-weight-medium d-none d-sm-inline-flex"
      >
        <v-icon start icon="mdi-database-check" size="14" />
        {{ totalCount }} Rockets Available
      </v-chip>

      <slot name="actions" />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rocket'

const store = useRocketStore()
const totalCount = computed(() => store.allRockets.length)
</script>

<style scoped>
.line-height-1 {
  line-height: 1.2;
}
.gap-3 {
  gap: 12px;
}
</style>
