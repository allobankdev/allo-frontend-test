<template>
  <nav aria-label="Main navigation" class="border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <span class="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <v-icon icon="mdi-rocket-launch" aria-hidden="true" />
        <span>SpaceX Rockets</span>
      </span>

      <ul class="flex items-center">
        <li>
          <RouterLink
            to="/"
            class="inline-block text-sm font-medium text-gray-700 hover:text-black pb-4 -mb-4"
            exact-active-class="text-black border-b-4 border-blue-500"
          >
            Rockets
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>