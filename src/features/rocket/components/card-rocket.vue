<template>
  <v-card
    :disabled="false"
    :loading="$props.isLoading"
    class="mx-auto my-12"
    max-width="374"
    @click="$emit('click')"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img height="250" :src="$props.img" cover></v-img>

    <v-card-item>
      <v-card-title>{{ $props.title }}</v-card-title>
    </v-card-item>

    <v-card-text>
      {{ $props.description }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  img: string;
  isLoading: boolean;
}
const $props = defineProps<Props>();
const $emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
