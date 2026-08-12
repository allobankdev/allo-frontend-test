<template>
  <v-app>
    <v-main>
      <DefaultLayout>
        <router-view />
      </DefaultLayout>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import DefaultLayout from "./layouts/DefaultLayout.vue";
</script>
