<script lang="ts" setup>
import { computed } from "vue";
import type { RocketResponse } from "@/types/rocket";

interface Props {
  rocket: RocketResponse;
}

const props = defineProps<Props>();

const { rocket } = props;

const rocketImage = computed(() => {
  return rocket.flickr_images.length > 0 ? rocket.flickr_images[0] : "https://placehold.co/600x400";
});

const emit = defineEmits<{
  "card-click": [rocket: RocketResponse];
}>();
</script>

<template>
  <v-card
    class="elevation-2 hover:elevation-4 hover:scale-105 transition-transform ease-in-out hover:translate-y-1"
    @click.stop="emit('card-click', rocket)"
  >
    <v-img
      :key="`${rocket.id}-${rocketImage}`"
      :src="rocketImage"
      height="200"
      cover
      class="position-relative"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
    </v-img>

    <v-card-title
      class="text-truncate text-body-5 font-weight-medium line-height-1 text-primary"
    >
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-2 text-truncate flex-grow">
        {{ rocket.description }}
      </p>
    </v-card-text>

    <MainButton @click.stop="emit('card-click', rocket)" class="w-100">
      View Detail
    </MainButton>
  </v-card>
</template>
