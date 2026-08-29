<template>
  <footer
    class="w-full bg-white border-t border-gray-200 shadow-sm"
  >
    <div
      class="max-w-7xl mx-auto h-14 px-4 flex items-center justify-between text-sm"
    >
      <!-- Left -->
      <div class="flex items-center gap-2 text-gray-600">
        <span class="font-semibold text-gray-800">🚀 Rocket App</span>
        <span class="hidden sm:inline">© {{ year }}</span>
      </div>

      <!-- Center -->
      <div class="hidden md:flex text-gray-500">
        Built with Vue 3 & Tailwind
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2 text-gray-600">
        <span>{{ formattedDate }}</span>
        <span class="font-bold">☝🏻 Rahandanu 👀</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import moment from "moment";

const formattedDate = moment().format("dddd, DD MMM YYYY");
const year = moment().year();
</script>
