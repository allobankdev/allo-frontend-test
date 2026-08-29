<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

const MAX_LENGTH = 140

const isLongDescription = computed(
  () => props.rocket.description.length > MAX_LENGTH
)

const shortDescription = computed(() =>
  isLongDescription.value
    ? props.rocket.description.slice(0, MAX_LENGTH) + '…'
    : props.rocket.description
)

const goToDetail = () => {
  router.push(`/rocket/${props.rocket.id}`)
}
</script>

<template>
  <v-card
    class="rocket-card"
    elevation="2"
    hover
  >
    <!-- Image -->
    <v-img
      height="200"
      :src="rocket.flickr_images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'"
      cover
      class="cursor-pointer"
      @click="goToDetail"
    />

    <!-- Content -->
    <v-card-title
      class="text-subtitle-1 font-weight-bold cursor-pointer"
      @click="goToDetail"
    >
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="description">
      {{ shortDescription }}

      <span
        v-if="isLongDescription"
        class="read-more"
        @click.stop="goToDetail"
      >
        Read more
      </span>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-card {
  cursor: default;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.description {
  min-height: 72px; /* 🔥 keeps card height consistent */
}

.read-more {
  margin-left: 6px;
  color: #1976d2;
  font-weight: 500;
  cursor: pointer;
}

.read-more:hover {
  text-decoration: underline;
}
</style>
