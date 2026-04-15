<template>
  <v-app>
    <StarBackground />
    <v-row class="nav">
      <v-col>
        <h2 class="text-center font-weight-bold mb-1 pt-3">Space-X</h2>
      </v-col>
    </v-row>
    <v-main class="position-relative" style="z-index: 1;">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import StarBackground from '@/components/StarBackground.vue'
</script>

<style scoped>
.nav {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  letter-spacing: 1rem !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-top:none;
  border-radius: 0 0 16px 16px;
  margin: 0 7rem 0 7rem;
  max-height: 90px;
}
</style>