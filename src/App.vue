<script lang="ts" setup>
//
</script>

<template>
  <v-app>
    <v-app-bar
      flat
      color="surface"
      border
    >
      <v-app-bar-title>
        <RouterLink
          to="/"
          class="brand-link"
        >
          <span aria-hidden="true">🚀</span> SpaceX Rockets
        </RouterLink>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container
        class="py-6"
        style="max-width: 1100px"
      >
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.brand-link {
  color: inherit;
  text-decoration: none;
  font-weight: 700;
}
</style>
