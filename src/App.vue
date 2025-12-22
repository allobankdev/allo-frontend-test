<template>
  <v-app>
    <v-progress-linear
      :active="isGlobalLoading"
      indeterminate
      absolute
      top
      color="primary"
      height="4"
      style="z-index: 9999"
    ></v-progress-linear>

    <HeaderNavigation />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import HeaderNavigation from "@/layout/HeaderNavigation.vue";
import { isGlobalLoading } from "@/stores/loading";
</script>
