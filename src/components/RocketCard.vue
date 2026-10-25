<template>
  <v-card
    class="rocket-card d-flex flex-column"
    height="100%"
    rounded="lg"
    variant="elevated"
    hover
    @click="$emit('click')"
  >
    <v-img
      :src="rocket.image_url ?? undefined"
      :alt="rocket.full_name"
      cover
      height="200"
      class="bg-grey-darken-3"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon
            color="grey"
            icon="mdi-rocket-launch-outline"
            size="64"
          />
        </div>
      </template>
      <template #error>
        <div class="d-flex align-center justify-center fill-height">
          <v-icon
            color="grey"
            icon="mdi-image-off-outline"
            size="64"
          />
        </div>
      </template>
    </v-img>

    <v-card-title class="text-h6 pt-4">
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text class="text-body-2 text-medium-emphasis flex-grow-1">
      {{ truncatedDescription }}
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn
        color="primary"
        variant="tonal"
        size="small"
        append-icon="mdi-arrow-right"
      >
        Lihat Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  click: []
}>()

const truncatedDescription = computed(() => {
  const desc = props.rocket.description
  if (!desc) return 'Tidak ada deskripsi.'
  return desc.length > 120 ? desc.slice(0, 120) + '...' : desc
})
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}
</style>
