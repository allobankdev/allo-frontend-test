<template>
  <v-app>
    <v-app-bar flat height="72" class="app-header">
      <v-container
        class="d-flex align-center justify-space-between py-0"
        max-width="1200"
      >
        <router-link
          to="/"
          class="brand-link d-flex align-center ga-3 text-decoration-none"
        >
          <span
            class="brand-badge d-inline-flex align-center justify-center"
            aria-hidden="true"
          >
            <v-icon icon="mdi-rocket-launch" color="primary" size="20" />
          </span>
          <span class="brand-title text-h6 font-weight-bold">{{
            APP_TITLE
          }}</span>
        </router-link>

        <v-btn
          v-if="isListPage"
          color="primary"
          variant="flat"
          rounded="lg"
          prepend-icon="mdi-plus"
          class="text-none font-weight-medium"
          @click="setAddDialogOpen(true)"
        >
          Add rocket
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="app-main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { APP_TITLE } from "@/constants/app";
import { useRocketStore } from "@/stores/rockets";

const route = useRoute();
const { setAddDialogOpen } = useRocketStore();

const isListPage = computed(() => route.path === "/");
</script>

<style scoped>
.app-header {
  background: rgba(11, 16, 23, 0.82) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--app-border);
}

.brand-link,
.brand-link:visited {
  color: rgb(var(--v-theme-on-surface));
}

.brand-link:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
  border-radius: 8px;
}

.brand-badge {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.28);
}

.brand-title {
  letter-spacing: -0.015em;
  color: #f1f5f9;
}

@supports ((background-clip: text) or (-webkit-background-clip: text)) {
  .brand-title {
    background-image:
      linear-gradient(
        110deg,
        transparent 0%,
        transparent 38%,
        rgba(255, 255, 255, 0.96) 48%,
        rgba(147, 197, 253, 0.95) 54%,
        transparent 64%,
        transparent 100%
      ),
      linear-gradient(#cbd5e1, #cbd5e1);
    background-size:
      220% 100%,
      100% 100%;
    background-position:
      160% 0,
      0 0;
    background-repeat: no-repeat;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: brand-shine 6s linear infinite;
  }
}

@keyframes brand-shine {
  0% {
    background-position:
      160% 0,
      0 0;
  }
  18%,
  100% {
    background-position:
      -160% 0,
      0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .brand-title {
    animation: none;
    background-image: none;
    color: #f1f5f9;
    -webkit-text-fill-color: #f1f5f9;
  }
}
</style>
