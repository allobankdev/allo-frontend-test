<script setup lang="ts">
import type { Result } from '@/types/rocket';

defineProps<{ data: Result[] }>();

const fallbackImage = 'https://placehold.net/default.svg';

const handleImageError = (event: Event) => {
  const image = event.target as HTMLImageElement;
  image.onerror = null;
  image.src = fallbackImage;
};
</script>

<template>
    <RouterLink
      v-for="rocket in data"
      :key="rocket.id"
      :to="`/rockets/${rocket.id}`"
      class="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
    >
      <div class="relative overflow-hidden bg-gray-100">
        <img
          :src="rocket.image_url || fallbackImage"
          :alt="rocket.name"
          class="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          @error="handleImageError"
        />

        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        <div class="absolute bottom-4 left-4">
          <span class="rounded-full border border-white/40 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {{ rocket.manufacturer.country_code }}
          </span>
        </div>

        <div class="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 transition-transform duration-300 group-hover:translate-x-1">
          <v-icon icon="mdi-arrow-top-right" size="18" />
        </div>
      </div>

      <div class="p-5">
        <h2 class="text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-gray-600">
          {{ rocket.full_name }}
        </h2>

        <p class="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-500">
          {{ rocket.description || 'Discover more about this rocket and its specifications.' }}
        </p>

        <div class="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <span class="text-xs font-medium uppercase tracking-wider text-gray-400">
            Explore rocket
          </span>

          <span class="text-sm font-semibold text-gray-900 transition-transform group-hover:translate-x-1">
            View details
            <v-icon icon="mdi-arrow-right" size="16" class="ml-1" />
          </span>
        </div>
      </div>
    </RouterLink>
</template>
