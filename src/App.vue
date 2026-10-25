<template>
  <v-app>
    <v-app-bar flat border="b">
      <v-container class="d-flex align-center">
        <router-link to="/" class="app-brand text-decoration-none text-high-emphasis">
          <v-icon icon="mdi-rocket-launch" color="primary" class="mr-2" />
          <span class="font-weight-bold">Rocket Registry</span>
        </router-link>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="py-8">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>

<style scoped>
.app-brand {
  display: inline-flex;
  align-items: center;
}
</style>
