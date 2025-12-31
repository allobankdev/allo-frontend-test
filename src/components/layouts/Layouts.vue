<!-- layouts/DefaultLayout.vue -->
<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col max-w-full!">
    <Header />

    <main class="flex-1 px-6 py-4">
      <router-view />
    </main>

    <Footer />
  </div>
</template>
