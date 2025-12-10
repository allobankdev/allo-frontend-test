<template>
  <div class="d-flex flex-column justify-center align-center mb-6">
    <p>{{ $props.errorMessage }}</p>
    <v-btn class="ml-4" color="primary" @click="$emit('retry')"> Retry</v-btn>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  errorMessage: string;
}
const $props = defineProps<Props>();
const $emit = defineEmits<{
  (e: "retry"): void;
}>();
</script>
