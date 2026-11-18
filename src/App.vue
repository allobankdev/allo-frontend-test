<template>
  <v-app>
    <v-app-bar
      flat
      border
      color="surface"
    >
      <v-app-bar-nav-icon>
        <v-icon
          icon="mdi-rocket-launch"
          color="primary"
        />
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        <router-link
          to="/"
          class="text-decoration-none text-high-emphasis font-weight-bold"
        >
          Allo Rockets
        </router-link>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
</script>
