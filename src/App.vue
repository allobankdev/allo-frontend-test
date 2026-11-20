<template>
  <v-app>
    <v-app-bar
      class="fleet-bar"
      flat
      height="64"
    >
      <div class="u-container fleet-bar__inner">
        <router-link
          to="/"
          class="brand"
          aria-label="SpaceX Fleet archive, go to fleet index"
        >
          <svg
            class="brand__mark"
            viewBox="0 0 32 32"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M16 4 25 27l-9-5-9 5z"
              fill="currentColor"
            />
          </svg>
          <span class="brand__text">
            <span class="brand__name">SPACEX FLEET</span>
            <span class="brand__sub u-mono">LAUNCH ARCHIVE / LL2 2.2.0</span>
          </span>
        </router-link>

        <div class="fleet-bar__actions">
          <v-btn
            :aria-label="themeToggleLabel"
            :title="themeToggleLabel"
            icon
            size="small"
            variant="text"
            @click="toggleTheme"
          >
            <v-icon
              :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
              size="20"
            />
          </v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer class="fleet-footer">
      <div class="u-container fleet-footer__inner u-mono">
        <span>SPACEX FLEET ARCHIVE</span>
        <span class="fleet-footer__mid">DATA / LAUNCH LIBRARY 2.2.0</span>
        <span>ALLO BANK / FRONTEND ASSIGNMENT</span>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

const THEME_KEY = 'fleet-theme';
const isDark = computed(() => theme.global.current.value.dark);
const themeToggleLabel = computed(
  () => `Switch to ${isDark.value ? 'light' : 'dark'} theme`
);

onMounted(() => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'fleet' || saved === 'fleet-light') {
    theme.global.name.value = saved;
  }
});

function toggleTheme() {
  const next = isDark.value ? 'fleet-light' : 'fleet';
  theme.global.name.value = next;
  localStorage.setItem(THEME_KEY, next);
}
</script>

<style scoped>
.fleet-bar {
  border-bottom: 1px solid var(--fleet-hairline);
}

.fleet-bar :deep(.v-toolbar__content) {
  padding: 0;
}

.fleet-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 64px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.brand__mark {
  width: 22px;
  height: 22px;
  flex: none;
  color: rgb(var(--v-theme-primary));
}

.brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1;
  min-width: 0;
}

.brand__name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.14em;
  white-space: nowrap;
}

.brand__sub {
  margin-top: 4px;
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: rgba(var(--v-theme-on-surface), 0.55);
  white-space: nowrap;
}

.fleet-bar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fleet-footer {
  background: transparent;
  border-top: 1px solid var(--fleet-hairline);
  padding: 0;
}

.fleet-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding-block: 18px;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

@media (max-width: 600px) {
  .brand__sub {
    display: none;
  }

  .fleet-footer__inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .fleet-footer__mid {
    display: none;
  }
}
</style>
