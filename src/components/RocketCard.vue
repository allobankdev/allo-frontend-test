<template>
  <v-card
    v-for="rocket in props.data"
    :key="rocket.id"
    class="cursor-pointer"
    height="150"
    elevation="4"
    rounded="lg"
    @click="emits('toRocketDetail', rocket.id)"
  >
    <v-row no-gutters>
      <!-- IMAGE -->
      <v-col cols="4">
        <v-img
          :src="rocket.flickr_images?.[0]"
          height="150"
          cover
          class="rounded-l-lg"
        >
          <template #placeholder>
            <v-skeleton-loader type="image" height="120" />
          </template>
        </v-img>
      </v-col>

      <!-- TEXT -->
      <v-col cols="8" class="pa-2">
        <v-card-title class="text-h6 font-weight-bold">
          {{ rocket.name }}
        </v-card-title>

        <v-card-text>
          {{ rocket.description }}
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from "@/types/rockets";
import type { PropType } from "vue";

const props = defineProps({
  data: { type: Array as PropType<Rocket[]>, default: () => [] },
});

const emits = defineEmits<{
  (e: "toRocketDetail", id: string): void;
}>();
</script>
