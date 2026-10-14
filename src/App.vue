<template>
  <v-app>
    <StarfieldBackground />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import StarfieldBackground from '@/components/StarfieldBackground.vue'
</script>

<style>
.v-application {
  background: transparent !important;
}
</style>
