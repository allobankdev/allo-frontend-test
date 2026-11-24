<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="h-100"
    :aria-label="`Lihat detail ${name}`"
  >
    <RocketImage :src="rocket.imageUrl" :name="name" />
    <v-card-title class="text-wrap">
      {{ name }}
    </v-card-title>
    <v-card-text>
      <v-chip v-if="rocket.source === 'local'" size="small" class="mb-3">
        Rocket lokal
      </v-chip>
      <p class="description">
        {{ displayText(rocket.description, "Deskripsi belum tersedia.") }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Rocket } from "@/types/rocket";
import { displayText } from "@/utils/rocket";

const props = defineProps<{ rocket: Rocket }>();
const name = computed(() =>
  displayText(props.rocket.name, "Rocket tanpa nama"),
);
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}
</style>
