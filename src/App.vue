<template>
  <v-app>
    <v-main>
      <v-app-bar :elevation="12">
        <v-app-bar-title>Rocket Application</v-app-bar-title>
        <template #append>
          <search />
        </template>
      </v-app-bar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
