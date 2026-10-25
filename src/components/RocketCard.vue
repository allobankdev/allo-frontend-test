<template>
  <v-card
    class="h-100 d-flex flex-column"
    elevation="2"
    rounded="lg"
    @click="goToDetail"
  >
    <template v-if="rocket.image_url">
      <v-img
        :src="rocket.image_url"
        :alt="rocket.full_name"
        height="220"
        cover
      />
    </template>

    <div
      v-else
      class="d-flex align-center justify-center bg-grey-lighten-3"
      style="height: 220px;"
    >
      <span class="text-medium-emphasis">
        No image available
      </span>
    </div>

    <v-card-title>
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text class="flex-grow-1 rocket-description">
      {{
        rocket.description || 'No description available.'
      }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{
    rocket: Rocket
  }>()

  const router = useRouter()

  function goToDetail() {
    router.push(`/rockets/${props.rocket.id}`)
  }
</script>

<style scoped>
.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>