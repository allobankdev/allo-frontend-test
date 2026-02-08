<template>
  <v-card class="mx-auto h-100" hover @click="navigate">
    <v-img
      :src="rocket.flickr_images[0] || 'https://via.placeholder.com/400'"
      height="200px"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey-lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-title class="font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <div class="text-truncate-2">
        {{ rocket.description }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Rocket } from "@/types/rocket";

const props = defineProps<{ rocket: Rocket }>();
const router = useRouter();

const navigate = () => {
  router.push(`/rocket/${props.rocket.id}`);
};
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
