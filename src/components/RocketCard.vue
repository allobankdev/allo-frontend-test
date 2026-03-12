<template>
  <v-card
    class="rocket-card"
    rounded="lg"
    elevation="2"
    @click="goToDetail"
  >
    <v-img
      :src="rocket.flickr_images[0]"
      height="200"
      cover
      class="bg-grey-darken-3"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey" />
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-h6">{{ rocket.name }}</v-card-title>

    <v-card-subtitle>
      <v-chip
        :color="rocket.active ? 'success' : 'error'"
        size="small"
        class="mr-2"
      >
        {{ rocket.active ? 'Active' : 'Inactive' }}
      </v-chip>
      {{ rocket.country }}
    </v-card-subtitle>

    <v-card-text class="text-body-2">
      {{ truncatedDescription }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{ rocket: Rocket }>()
const router = useRouter()

const truncatedDescription = computed(() => {
  const desc = props.rocket.description
  return desc.length > 120 ? desc.slice(0, 120) + '...' : desc
})

function goToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.rocket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}
</style>
