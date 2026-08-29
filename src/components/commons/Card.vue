<script setup lang="ts">
import { cn } from "@/core/libs/common";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "bg-white rounded-lg shadow-md p-4 border border-gray-200",
  {
    variants: {
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type CardVariants = VariantProps<typeof cardVariants>;

interface IProps {
  title?: string;
  size?: CardVariants["size"];
  class?: string;
}

const props = defineProps<IProps>();
</script>

<template>
  <div :class="cn(cardVariants({ size }), props.class)">
    <div v-if="title" class="mb-3">
      <h3 class="font-semibold text-lg text-gray-900">{{ title }}</h3>
    </div>
    <slot />
  </div>
</template>
