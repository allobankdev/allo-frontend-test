<template>
  <header class="flex items-center gap-3 rounded-3xl bg-canvas p-3 sm:px-5">
    <button
      aria-label="Open menu"
      class="icon-btn border-transparent bg-white text-xl lg:hidden"
      type="button"
      @click="ui.sidebarOpen = true"
    >
      <i class="mdi mdi-menu" />
    </button>

    <label class="flex h-12 w-full max-w-sm items-center gap-3 rounded-full bg-white px-4">
      <i class="mdi mdi-magnify text-xl text-muted" />
      <input
        ref="searchInput"
        class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        placeholder="Search rocket"
        type="search"
        :value="rocketStore.filters.search ?? ''"
        @input="onSearch"
      >
      <kbd class="hidden rounded-md bg-canvas px-2 py-0.5 text-xs text-muted sm:inline">/</kbd>
    </label>

    <div class="ml-auto hidden items-center gap-3 rounded-full bg-white py-2 pr-4 pl-2 sm:flex">
      <span class="flex size-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <i class="mdi mdi-database-outline" />
      </span>
      <div class="leading-tight">
        <p class="text-sm font-semibold">
          Launch Library 2
        </p>
        <p class="flex items-center gap-1.5 text-xs text-muted">
          <span
            class="size-1.5 rounded-full"
            :class="syncState.dot"
          />
          {{ syncState.label }}
        </p>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRocketStore } from '@/stores/rockets'
  import { useUiStore } from '@/stores/ui'

  const ui = useUiStore()
  const rocketStore = useRocketStore()
  const route = useRoute()
  const router = useRouter()
  const searchInput = ref<HTMLInputElement>()

  const syncState = computed(() => {
    switch (rocketStore.listStatus) {
      case 'success': return { label: 'Data synced', dot: 'bg-brand-500' }
      case 'error': return { label: 'Sync failed', dot: 'bg-red-500' }
      case 'loading': return { label: 'Syncing...', dot: 'bg-amber-400 animate-pulse' }
      default: return { label: 'Not synced yet', dot: 'bg-gray-300' }
    }
  })

  function onSearch (event: Event) {
    rocketStore.filters.search = (event.target as HTMLInputElement).value
    if (route.path !== '/') router.push('/')
  }

  function focusOnSlash (event: KeyboardEvent) {
    const target = event.target as HTMLElement
    if (event.key !== '/' || ['INPUT', 'TEXTAREA'].includes(target.tagName)) return
    event.preventDefault()
    searchInput.value?.focus()
  }

  onMounted(() => window.addEventListener('keydown', focusOnSlash))
  onBeforeUnmount(() => window.removeEventListener('keydown', focusOnSlash))
</script>
