<script setup lang="ts">
import type { Rocket } from "@/types/rocket";

defineProps<{
  rocket: Rocket;
}>();

const emit = defineEmits<{
  detail: [];
}>();
</script>

<template>
  <v-card
    class="rocket-card"
    elevation="2"
    variant="text"
    :to="`/rockets/${rocket.id}`"
  >
    <v-img :src="rocket.image || undefined" height="220" cover>
      <template #error>
        <div class="image-placeholder">No Image</div>
      </template>
    </v-img>

    <v-card-title>
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <div>
        <strong>Description:</strong>
        {{ rocket.description || " " }}
      </div>
    </v-card-text>

    <!-- <v-card-actions>
      <v-btn variant="text" :to="`/rockets/${rocket.id}`"></v-btn>
    </v-card-actions> -->
  </v-card>
</template>

<style scoped>
.rocket-card {
  height: 100%;
}

.image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
