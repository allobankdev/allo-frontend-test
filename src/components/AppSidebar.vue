<template>
  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="ui.sidebarOpen"
      class="fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden"
      @click="ui.sidebarOpen = false"
    />
  </Transition>

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col rounded-r-3xl bg-canvas p-6 transition-transform lg:sticky lg:top-6 lg:h-[calc(100vh-4.5rem)] lg:translate-x-0 lg:rounded-3xl"
    :class="ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <router-link
      class="flex items-center gap-3"
      to="/"
    >
      <span class="flex size-10 items-center justify-center rounded-full border-[3px] border-brand-700 text-xl text-brand-700">
        <i class="mdi mdi-rocket-launch" />
      </span>
      <span class="text-xl font-semibold">Rocketry</span>
    </router-link>

    <nav class="mt-10 flex flex-col gap-8 text-sm">
      <div>
        <p class="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          Menu
        </p>
        <router-link
          class="nav-item"
          :class="{ 'nav-item-active': isRocketsRoute }"
          to="/"
        >
          <i class="mdi mdi-view-grid-outline text-xl" />
          <span class="flex-1">Rockets</span>
          <span
            v-if="rocketStore.counts.all"
            class="rounded-md bg-brand-900 px-1.5 py-0.5 text-[10px] font-semibold text-white"
          >
            {{ rocketStore.counts.all }}
          </span>
        </router-link>
      </div>

      <div>
        <p class="mb-3 text-xs font-medium uppercase tracking-wider text-muted">
          General
        </p>
        <a
          class="nav-item"
          href="https://thespacedevs.com/llapi"
          rel="noopener"
          target="_blank"
        >
          <i class="mdi mdi-book-open-variant-outline text-xl" />
          <span class="flex-1">API Docs</span>
          <i class="mdi mdi-open-in-new" />
        </a>
      </div>
    </nav>

    <div class="relative mt-auto overflow-hidden rounded-2xl bg-brand-900 p-4 text-white">
      <div class="absolute -right-10 -bottom-12 size-40 rounded-full border-[18px] border-brand-700/60" />
      <div class="absolute -right-4 -bottom-6 size-24 rounded-full border-[10px] border-brand-500/40" />
      <div class="relative">
        <span class="flex size-8 items-center justify-center rounded-full bg-white text-brand-900">
          <i class="mdi mdi-rocket-launch-outline" />
        </span>
        <p class="mt-3 text-lg leading-tight font-semibold">
          Build your own rocket
        </p>
        <p class="mt-1 text-xs text-white/70">
          Add it to the list in seconds
        </p>
        <button
          class="btn mt-4 w-full bg-brand-600 text-white hover:bg-brand-500"
          type="button"
          @click="ui.rocketFormOpen = true"
        >
          Add Rocket
        </button>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '@/stores/rockets'
  import { useUiStore } from '@/stores/ui'

  const ui = useUiStore()
  const rocketStore = useRocketStore()
  const route = useRoute()

  const isRocketsRoute = computed(() => route.path === '/' || route.path.startsWith('/rockets'))
</script>

<style scoped>
@reference '../styles/main.css';

.nav-item {
  @apply relative -mx-6 flex items-center gap-3 px-6 py-2.5 text-muted transition hover:text-ink;
}

.nav-item-active {
  @apply font-semibold text-ink before:absolute before:inset-y-1 before:left-0 before:w-1.5 before:rounded-r-full before:bg-brand-700;
}

.nav-item-active i:first-child {
  @apply text-brand-700;
}
</style>
