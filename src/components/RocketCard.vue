<template>
  <v-card
    class="mx-auto"
    max-width="400"
    height="100%"
    @click="handleClick(props.rocket.id)"
  >
    <v-img
      class="align-end text-white"
      height="200"
      :src="props.rocket.flickr_images[0]"
      cover
    >
    </v-img>
    <v-card-title>{{ props.rocket.name }}</v-card-title>

    <v-card-subtitle class="pt-4"> {{ props.rocket.country }} </v-card-subtitle>

    <v-card-text>
      <p>{{ props.rocket.description }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { type Rocket } from "@/types/rockets";
const props = defineProps<{
  rocket: Rocket;
}>();
const router = useRouter();

const handleClick = (id: string) => {
  router.push(`/rocket/${id}`);
};
</script>
