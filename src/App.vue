<template>
  <v-app>
    <main-layout>
      <router-view />
    </main-layout>
  </v-app>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useTheme } from "vuetify";

import MainLayout from "@/layouts/main-layout.vue";

const theme = useTheme();

watch(
  () => theme.global.name.value,
  (val) => {
    document.documentElement.classList.toggle("dark", val === "dark");
  },
  { immediate: true }
);
</script>
