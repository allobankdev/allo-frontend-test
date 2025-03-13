<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

import type { Rocket } from "@/types/rocket";

defineProps<{ rocket: Rocket }>();
</script>

<template>
  <v-card
    class="mx-auto cursor-pointer"
    @click="router.push(`/rocket/${rocket.id}`)"
  >
    <v-img
      height="200px"
      :src="rocket.flickr_images[0]"
      cover
    />

    <v-card-title>
      {{ rocket.name }}
    </v-card-title>

    <v-card-actions>
      <v-btn
        color="orange-lighten-2"
        text="Description"
      />

      <v-spacer />

      <v-btn
        :icon="rocket.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click.stop="rocket.show = !rocket.show"
      />
    </v-card-actions>

    <v-expand-transition>
      <div v-show="rocket.show">
        <v-divider />

        <v-card-text>
          {{ rocket.description }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>