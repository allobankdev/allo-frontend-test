<template>
  <v-card
    class="mb-4"
    @click="$emit('click')"
  >
    <v-img
      v-if="rocket.imageUrl"
      :src="rocket.imageUrl"
      height="200"
      cover
    />
    <v-card-item
      v-else
      class="d-flex align-center justify-center"
      style="height: 200px; background: #eee"
    >
      <span class="text-caption text-grey">No image available</span>
    </v-card-item>

    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-text>
      {{ rocket.description ?? "No description available" }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from "@/types/rocket";

defineProps<{ rocket: Rocket }>();
defineEmits<{ click: [] }>();
</script>
