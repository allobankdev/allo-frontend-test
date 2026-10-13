<template>
  <v-app>
    <Nav />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import Nav from "@/components/Nav.vue";
</script>
