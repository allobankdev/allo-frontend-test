<script setup lang="ts">
import type { DisplayRocket } from "@/schema/rocket.schema";
import { ListIcon } from "lucide-vue-next";
defineProps<{
  rocket: DisplayRocket;
}>();
</script>

<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    elevation="2"
    rounded="xl"
    hover
    class="group overflow-hidden transition-all duration-300 hover:shadow-lg"
  >
    <div class="grid grid-cols-1 md:grid-cols-12">
      <!-- Image -->
      <div class="md:col-span-4">
        <v-img :src="rocket.flickr_images?.[0]" min-height="220" cover>
          <v-chip
            v-if="rocket.active"
            color="success"
            size="small"
            class="ma-2"
          >
            Active
          </v-chip>
        </v-img>
      </div>

      <!-- Content -->
      <div class="md:col-span-8 p-5 flex flex-col">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ rocket.name }}
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            First flight: {{ rocket.first_flight }}
          </p>

          <p class="mt-3 text-sm text-gray-700 line-clamp-3">
            {{ rocket.description }}
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-auto pt-4 flex items-center gap-2">
          <v-chip size="small" variant="tonal" color="primary">
            {{ rocket.country }}
          </v-chip>

          <div class="flex-1" />

          <v-btn
            variant="text"
            color="primary"
            @click.stop="$router.push(`/rockets/${rocket.id}`)"
          >
          <ListIcon/>
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>
