<template>
  <v-card
    class="rocket-card"
    height="100%"
    @click="navigateToDetail"
    elevation="2"
  >
    <v-img
      :src="rocket.flickr_images[0] || '/placeholder-rocket.jpg'"
      height="200px"
      cover
      class="rocket-image"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-5"/>
        </v-row>
      </template>
    </v-img>

    <v-card-title>{{ rocket.name }}</v-card-title>

    <v-card-text>
      <p class="rocket-description">{{ truncatedDescription }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        variant="tonal"
        color="primary"
        @click.stop="navigateToDetail"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps<{
  rocket: Rocket;
}>();
const router = useRouter();
const truncatedDescription = computed(() => {
  const maxLength = 150;
  if (props.rocket.description.length > maxLength) {
    return `${props.rocket.description.substring(0, maxLength)}...`;
  }
  return props.rocket.description;
});
const navigateToDetail = () => {
  router.push({
    name: 'rocket-detail',
    params: { id: props.rocket.id }
  });
};
</script>

<style scoped>
.rocket-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.rocket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>