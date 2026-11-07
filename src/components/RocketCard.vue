<template>
    <v-card height="100%" class="rocket-card d-flex flex-column">
    <v-img
      v-if="rocket.imageUrl && !imageError"
      :key="rocket.imageUrl"
      :src="rocket.imageUrl"
      height="220"
      cover
      @error="imageError = true"
    />

    <div
      v-else
      class="d-flex align-center justify-center bg-grey-lighten-3"
      style="height: 220px"
    >
      <v-icon
        icon="mdi-image-off-outline"
        size="40"
        color="grey"
        class="mb-2"
      />
      <span class="text-medium-emphasis">
        No image available
      </span>
    </div>

    <v-card-title class="text-wrap">
        {{ rocket.name }}
    </v-card-title>

    <v-card-text class="flex-grow-1">
        <p class="text-body-2 text-medium-emphasis rocket-description">
            {{ rocket.description }}
        </p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        :to="`/rockets/${rocket.id}`"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const imageError = ref(false)

watch(
  () => props.rocket.imageUrl,
  () => {
    imageError.value = false
  },
)
</script>


<style scoped>
.rocket-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
