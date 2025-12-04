<template>
  <v-app class="w-100">
    <!-- NAVBAR -->
    <v-app-bar color="primary" dark>
      <v-toolbar-title>SpaceX Explorer</v-toolbar-title>

      <v-spacer />

      <!-- Link ke Home -->
      <v-btn v-if="isHomePage" to="/" text>Home</v-btn>

      <!-- Tampil hanya jika bukan di halaman Home -->
      <v-btn v-if="!isHomePage" text color="yellow" @click="goHome">
        Back to Home
      </v-btn>
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
