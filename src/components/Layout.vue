<template>
  <v-app>
    <!-- NAVBAR -->
    <v-app-bar color="primary" dark class="pr-6 position-fixed top-0">
      <v-toolbar-title>SpaceX Explorer</v-toolbar-title>

      <!-- Tampil hanya jika bukan di halaman Home -->
      <v-btn v-if="!isHomePage" text @click="goHome"> Back to Home </v-btn>
    </v-app-bar>

    <!-- MAIN CONTENT -->
    <v-main class="ma-4">
      <v-container class="mx-auto" max-width="900">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// halaman "/" dianggap home
const isHomePage = computed(() => route.path === "/");
function goHome() {
  router.push("/");
}
</script>
