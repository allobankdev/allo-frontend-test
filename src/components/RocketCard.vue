<template>
  <v-card
    class="d-flex flex-column flex-grow-1"
    @click="$emit('click')"
  >
    <v-img
      v-if="rocket.image_url && !imgError"
      :src="rocket.image_url"
      height="160"
      cover
      @error="imgError = true"
    />
    <div
      v-else
      class="d-flex align-center justify-center bg-surface-variant"
      style="height: 160px"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="48"
      />
    </div>

    <v-card-title>{{ rocket.full_name }}</v-card-title>

    <v-card-text class="pb-4">
      <p class="description">
        {{ rocket.description || "No description available." }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Rocket } from "@/types/rocket";

defineProps<{ rocket: Rocket }>();
defineEmits<{ click: [] }>();

const imgError = ref(false);
</script>

<style scoped>
.description {
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}
</style>
