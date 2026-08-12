<template>
  <v-card :to="`/rockets/${rocket.id}`" height="100%">
    <v-img :src="rocket.image_url ?? undefined" height="180" cover>
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
          <v-icon color="grey" icon="mdi-rocket-launch-outline" size="48" />
        </div>
      </template>
    </v-img>

    <v-card-title>{{ rocket.full_name }}</v-card-title>

    <v-card-text>
      <p class="text-truncate-3">
        {{ rocket.description ?? 'No description available.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
