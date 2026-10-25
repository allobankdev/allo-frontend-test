<!-- eslint-disable vue/max-attributes-per-line -->
<script setup lang="ts">
import type { Rocket } from '@/types/rocket';


defineProps<{
  rocket: Rocket;
}>();

const fallbackImage =
  "https://via.placeholder.com/400x250?text=No+Rocket+Image";
</script>

<template>
  <v-card
    class="h-100 d-flex flex-column"
    elevation="2"
    hover
  >
    <v-img
      :src="rocket.image_url || fallbackImage"
      class="bg-grey-lighten-2"
      height="220"
      cover
      alt="Rocket Image"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="grey-lighten-1"
          />
        </div>
      </template>
    </v-img>
    <v-card-item>
      <v-card-title class="font-weight-bold">
        {{
          rocket.full_name
        }}
      </v-card-title>
    </v-card-item>
    <v-card-text class="flex-grow-1">
      <p class="text-body-2 text-medium-emphasis text-truncate-3-lines">
        {{ rocket.manufacturer?.description || "Description not available for this rocket." }}
      </p>
    </v-card-text>
    <v-card-actions class="pa-4 pt-0">
      <v-btn
        color="primary"
        variant="elevated"
        block
        :to="`/rocket/${rocket.id}`"
      >
        Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
.text-truncate-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
