<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <v-app-bar
    :color="isScrolled ? 'transparent' : 'primary'"
    prominent
    :elevation="isScrolled ? 4 : 0"
  >
    <v-app-bar-title class="d-flex align-center justify-center">
      <v-icon class="mr-2">mdi-rocket-launch</v-icon>
      SpaceX Rockets
    </v-app-bar-title>
  </v-app-bar>
</template>
