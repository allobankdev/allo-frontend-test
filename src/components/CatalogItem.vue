<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      height="200px"
      :src="props.rocket.flickr_images[0]"
      cover
    />

    <v-card-title>
      {{ props.rocket.name }}
    </v-card-title>

    <v-card-subtitle>
      {{ props.rocket.country }}
    </v-card-subtitle>

    <v-card-actions>
      <DetailPage :rocket="props.rocket"/>

      <v-spacer />

      <v-btn
        :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="show = !show"
      />
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider />

        <v-card-text>
          {{ props.rocket.description }}
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DetailPage from "@/pages/DetailPage.vue";

const show = ref(false)

const props = defineProps<{
  rocket?: object
}>();
</script>
