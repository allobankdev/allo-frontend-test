<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>SpaceX Rockets Explorer</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app class="d-flex flex-column">
      <div>
        SpaceX Rockets Explorer &copy; {{ new Date().getFullYear() }}
      </div>
      <div class="text-caption">
        Powered by SpaceX API
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
