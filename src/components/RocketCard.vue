<template>
  <v-card class="h-100 d-flex flex-column" hover @click="goToDetail">
    <v-img
      :src="imgSrc"
      height="200"
      cover
      class="bg-grey-lighten-2"
      @error="imgSrc = fallbackImage"
    />

    <v-card-title class="font-weight-bold">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text class="text-body-2 text-medium-emphasis">
      {{ shortDescription }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import type { Rocket } from "@/stores/rocketStore";

const props = defineProps<{
  rocket: Rocket;
}>();

const router = useRouter();

const fallbackImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="sans-serif" font-size="22">No Rocket Image</text></svg>',
  );

const imgSrc = ref(props.rocket.image || fallbackImage);

const shortDescription = computed(() => {
  if (props.rocket.description.length <= 130) {
    return props.rocket.description;
  }
  return props.rocket.description.slice(0, 130) + "...";
});

function goToDetail() {
  router.push(`/rockets/${props.rocket.id}`);
}
</script>
