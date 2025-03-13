<script setup lang="ts">
import Footer from './components/Footer.vue';
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>