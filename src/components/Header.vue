<template>
  <v-app-bar :elevation="1" class="pl-4">
    <v-btn to="/" :ripple="false" variant="plain">
      <v-icon icon="mdi-rocket"></v-icon>
      <v-app-bar-title>Rocket Launch</v-app-bar-title>
    </v-btn>

    <template v-slot:append>
      <AddRocket v-show="isHome" />
      <v-btn :icon="theme.theme === 'dark' ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
        @click="theme.toggle"></v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import {useThemeStore} from '@/stores/useThemeStore'
import {useRoute} from 'vue-router'
import {computed} from 'vue'

const route = useRoute()
const isHome = computed(() => route.path === '/')
const theme = useThemeStore()
</script>
