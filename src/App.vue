<template>
  <v-app>
    <v-app-bar
      border="b"
      color="surface"
      elevation="0"
    >
      <v-container class="d-flex align-center py-0">
        <router-link
          class="d-flex align-center text-decoration-none text-high-emphasis"
          to="/"
        >
          <v-icon
            class="mr-2"
            color="primary"
            icon="mdi-rocket-launch"
            size="28"
          />
          <span class="text-h6 font-weight-bold">SpaceX Rockets</span>
        </router-link>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>