<template>
  <v-card
    class="mx-auto rocket-card d-flex flex-column"
    height="100%"
    hover
    @click="goToDetail"
  >
    <v-img
      :src="image"
      height="250"
      cover
      class="bg-grey-lighten-2"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="grey-lighten-5"
          />
        </div>
      </template>
    </v-img>

    <v-card-title class="text-h5 pt-4">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <p class="text-truncate-3">
        {{ rocket.description }}
      </p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        @click.stop="goToDetail"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const image = computed(() => {
  if (props.rocket.flickr_images && props.rocket.flickr_images.length > 0) {
    return props.rocket.flickr_images[0];
  }
  return "https://via.placeholder.com/400x250?text=No+Image";
});

const goToDetail = () => {
  router.push(`/rockets/${props.rocket.id}`);
};
</script>

<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rocket-card {
  transition: transform 0.2s;
}
.rocket-card:hover {
  transform: translateY(-5px);
}
</style>
