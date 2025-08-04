<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean;
  prependIcon?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "click"): void;
}>();

const openDialog = () => {
  emit("update:modelValue", true);
  emit("click");
};
</script>
<template>
  <v-btn
    color="primary"
    size="large"
    :prepend-icon="props.prependIcon"
    @click="openDialog"
  >
    <slot />
  </v-btn>
</template>
