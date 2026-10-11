<script setup lang="ts">
import {watch} from 'vue'
import {useTheme} from 'vuetify'
import {useThemeStore} from '@/stores/useThemeStore'

const themeStore = useThemeStore()
const vuetifyTheme = useTheme()

watch(
  () => themeStore.theme,
  (val) => {
    vuetifyTheme.change(val)
  },
  {immediate: true}
)
</script>

<template>
  <v-app>
    <v-main>
      <Header />
      <router-view />
    </v-main>
  </v-app>
</template>
