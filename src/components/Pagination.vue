<template>
  <div class="d-flex justify-center mt-8">
    <v-pagination
      v-model="proxyPage"
      :length="length"
      :total-visible="totalVisible"
      color="indigo"
      active-color="orange"
      class="text-white"
      :variant="variant"
      :rounded="rounded"
      elevation="2"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: number;
  length: number;
  totalVisible?: number;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  rounded?: string;
}

const props = withDefaults(defineProps<Props>(), {
  totalVisible: 5,
  color: "secondary",
  variant: "flat",
  rounded: "circle",
});

const emit = defineEmits(["update:modelValue"]);

const proxyPage = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
