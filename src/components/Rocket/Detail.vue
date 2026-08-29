<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="800"
    transition="dialog-bottom-transition"
  >
    <v-card v-if="props.rocket">
      <v-card-title>{{ props.rocket.name }}</v-card-title>
      <v-card-text>
        <v-img
          :src="props.rocket.flickr_images[0]"
          max-height="300"
          contain
        />
        <p>{{ props.rocket.description }}</p>
        <v-list dense>
          <v-list-item>Cost per Launch: ${{ props.rocket.cost_per_launch?.toLocaleString() }}</v-list-item>
          <v-list-item>Country: {{ props.rocket.country }}</v-list-item>
          <v-list-item>First Flight: {{ props.rocket.first_flight }}</v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="emit('update:modelValue', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { IDataRocket } from '@/types/rocket';

const props = defineProps<{
  modelValue: boolean;
  rocket: IDataRocket | null;
}>();
const emit = defineEmits(['update:modelValue']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>
