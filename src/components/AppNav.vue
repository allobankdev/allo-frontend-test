<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { storeToRefs } from 'pinia'
import { useRocketsStore } from '@/composables/useRocketsStore'

const theme = useTheme()
const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: v => (theme.global.name.value = v ? 'dark' : 'light'),
})
function toggleTheme() { isDark.value = !isDark.value }

const store = useRocketsStore()
const { filtered, loading } = storeToRefs(store)
const count = computed(() => filtered.value?.length ?? 0)

const drawer = ref(false)
</script>

<template>
  <v-app-bar class="appbar" flat density="comfortable">
    <div class="bar-inner">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = true" />

      <RouterLink to="/rockets" class="brand">
        <v-icon class="mr-2">mdi-rocket-launch</v-icon>
        <span>Allo Rockets</span>
      </RouterLink>

      <v-spacer />

      <div class="actions">
        <v-btn icon @click="toggleTheme" :title="isDark ? 'Light mode' : 'Dark mode'">
          <v-icon v-if="isDark">mdi-weather-sunny</v-icon>
          <v-icon v-else>mdi-weather-night</v-icon>
        </v-btn>

        <v-btn
          icon
          href="https://github.com/Fikriansyah-12?tab=repositories"
          target="_blank"
          rel="noreferrer"
          title="Open GitHub"
        >
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </div>
    </div>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary class="d-md-none">
    <v-list nav density="comfortable">
      <v-list-item
        :to="{ path: '/rockets' }"
        prepend-icon="mdi-rocket-launch"
        title="Rockets"
        @click="drawer=false"
      />
      <v-list-item
        prepend-icon="mdi-theme-light-dark"
        title="Toggle theme"
        @click="toggleTheme(); drawer=false"
      />
      <v-list-item
        href="https://github.com/Fikriansyah-12?tab=repositories"
        target="_blank"
        rel="noreferrer"
        prepend-icon="mdi-github"
        title="GitHub"
        @click="drawer=false"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
.appbar {
  backdrop-filter: blur(8px);
  background: color-mix(in oklab, rgb(var(--v-theme-surface)) 92%, transparent);
  border-bottom: 1px solid color-mix(in oklab, rgb(var(--v-theme-on-surface)) 12%, transparent);
  position: sticky; top: 0; z-index: 10; 
}

.bar-inner {
  width: min(1200px, 100% - 32px); 
  margin-inline: auto;
  display: flex; align-items: center; gap: 12px;
  padding-block: 2px;
}

.brand {
  display: inline-flex; align-items: center;
  font-weight: 800; text-decoration: none; color: inherit;
  padding: 6px 10px; border-radius: 10px;
}

.actions { display: inline-flex; align-items: center; gap: 10px; }

@media (max-width: 720px) {
  .bar-inner { width: min(100%, 100% - 24px); } 
}
</style>

