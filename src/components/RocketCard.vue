<template>
  <div>
    <v-card
      class="card"
      width="500"
      color="indigo-lighten-2"
      variant="tonal"
    >
      <v-img
        :src="rocket.links.patch.small"
        alt="Rocket Patch"
        height="200"
      />
      <hr class="card-border">
      <v-card-title>{{ rocket.name }}</v-card-title>
      <v-card-text class="card-text">{{ rocket.details }}</v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('openModal',rocket)">
          Details
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { Rocket } from '../types/Rocket';

defineEmits(["openModal"]);
defineProps<{rocket: Rocket}>();
</script>

<style lang="scss" scoped>
.card{
  display: block !important;

  &-text{
  overflow: hidden !important;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  word-wrap: break-word;
  max-height: 1.5em;
  overflow: hidden !important;
  }

  &-border{
    margin-top: 10px;
    border: 2px solid DodgerBlue
  }
}


</style>
