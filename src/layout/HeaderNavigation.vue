<template>
  <v-bottom-navigation
    :elevation="15"
    grow
    style="bottom: none; position: static"
  >
    <v-btn to="/">
      <v-icon>mdi-home</v-icon>
      <span>Home</span>
    </v-btn>
    <v-btn to="/rocket/list">
      <v-icon>mdi-rocket</v-icon>
      <span>Rocket List</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
//
</script>
