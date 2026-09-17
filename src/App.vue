<template>
  <div class="min-h-screen bg-[#e6e7e6] lg:p-6">
    <div class="mx-auto flex min-h-screen max-w-[1440px] gap-3 bg-white p-2 sm:p-3 lg:min-h-[calc(100vh-3rem)] lg:rounded-[2rem]">
      <AppSidebar />

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <AppTopbar />
        <main class="flex-1 rounded-3xl bg-canvas p-4 sm:p-6">
          <router-view />
        </main>
      </div>
    </div>

    <RocketFormDialog
      v-model="ui.rocketFormOpen"
      @submit="onAddRocket"
    />
  </div>
</template>

<script lang="ts" setup>
  import { watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRocketStore } from '@/stores/rockets'
  import { useUiStore } from '@/stores/ui'
  import type { NewRocket } from '@/types/rocket'

  const ui = useUiStore()
  const rocketStore = useRocketStore()
  const route = useRoute()
  const router = useRouter()

  function onAddRocket (input: NewRocket) {
    rocketStore.addRocket(input)
    if (route.path !== '/') router.push('/')
  }

  watch(() => route.fullPath, () => {
    ui.sidebarOpen = false
  })
</script>
