<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RocketList } from "@/types/index";

const props = defineProps<{
  rocket: RocketList;
}>();

const router = useRouter();

const detailRocketCard = () => {
  router.push(`/rocket/${props.rocket.id}`);
};
</script>

<template>
  <v-card class="rocket-card" elevation="4" height="380">
    <v-carousel height="220" hide-delimiters show-arrows="hover" cycle>
      <v-carousel-item
        v-for="(image, index) in rocket.flickr_images"
        :key="index"
        :src="image"
        cover
      />
    </v-carousel>

    <v-container @click="detailRocketCard">
      <v-card-title>
        {{ rocket.name }}
      </v-card-title>

      <v-card-text class="description">
        {{ rocket.description }}
      </v-card-text>
    </v-container>
  </v-card>
</template>

<style lang="scss" scoped>
.rocket-card {
  cursor: pointer;
  transition: 0.3s;
  height: 380px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
  }
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}

.v-card-text {
  flex-grow: 1;
}
</style>
