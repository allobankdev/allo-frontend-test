<template>
  <v-app-bar
    color="surface"
    elevation="2"
    border="b"
    class="px-2 px-sm-4"
  >
    <template #prepend>
      <v-avatar
        color="primary"
        size="40"
        class="mr-3"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="white"
          size="22"
        />
      </v-avatar>
    </template>

    <v-app-bar-title class="font-weight-bold">
      <router-link
        to="/"
        class="text-decoration-none text-high-emphasis d-flex align-center"
      >
        <span>SpaceX</span>
        <v-chip
          size="x-small"
          color="primary"
          variant="flat"
          class="ml-2 font-weight-bold"
        >
          Allo Explorer
        </v-chip>
      </router-link>
    </v-app-bar-title>

    <v-spacer />

    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-format-list-bulleted"
      class="text-none"
    >
      Rockets
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
// Presentational header component
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}
</style>
