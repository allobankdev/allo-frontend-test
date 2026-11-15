<template>
  <v-app>
    <v-main>
      <div class="relative min-h-screen bg-space-950 text-slate-300">
        <SpaceBackdrop />
        <div class="relative z-10 flex min-h-screen flex-col">
          <AppHeader />
          <div class="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <router-view />
          </div>
          <footer class="border-t border-space-800/80 bg-space-950/70">
            <div class="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 font-mono text-[11px] uppercase tracking-wider text-slate-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
              <span>Data: The Space Devs · Launch Library 2</span>
              <span>Locally added vehicles are kept for this session only</span>
            </div>
          </footer>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
</script>
