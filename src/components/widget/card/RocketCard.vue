<template>
  <v-card class="rocket-card" elevation="0" @click="handleClick">
    <v-img
      :src="rocket.flickr_images[0]"
      height="200"
      cover
      class="rocket-image"
    />

    <div class="content">
      <h3 class="title">{{ rocket.name }}</h3>
      <p class="subtitle">{{ rocket.country }}</p>
    </div>

    <div class="desc">
      <p class="text-truncate-3">
        {{ rocket.description }}
      </p>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const handleClick = () => {
  router.push(`/rocket/${props.rocket.id}`);
};
</script>

<style scoped lang="scss">
.rocket-card {
  height: 100%;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);

    .rocket-image {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  .rocket-image {
    transition: transform 0.4s ease;
  }

  .content {
    padding: 14px 16px 6px;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #222;
      margin: 0;
      line-height: 1.3;
    }

    .subtitle {
      font-size: 13px;
      color: #888;
      margin-top: 2px;
    }
  }

  .desc {
    padding: 0 16px 16px;

    p {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }
  }
}
</style>
