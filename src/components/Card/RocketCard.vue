<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Rocket } from "@/types/rocketTypes";

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

function viewDetails() {
  router.push(`/rocket/${props.rocket.id}`);
}
</script>

<template>
  <v-card class="rocket-card" hover @click="viewDetails">
    <v-img
      :src="
        rocket.flickr_images[0] ||
        'https://static.vecteezy.com/system/resources/previews/011/020/178/non_2x/simple-outline-rocket-icon-sign-illustration-free-vector.jpg'
      "
      height="200"
      cover
      class="rocket-image"
    />

    <v-card-title class="text-h6 font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <p class="rocket-description text-body-2">
        {{ rocket.description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
@use "../../styles/settings.scss" as *;

.rocket-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba($primary-color, 0.15);
  }

  .rocket-image {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent 60%);
    }
  }

  .rocket-description {
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
