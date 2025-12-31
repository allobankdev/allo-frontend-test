<script setup lang="ts">
import { cn } from "@/core/libs/common";
import { cva, type VariantProps } from "class-variance-authority";
import { useAttrs } from "vue";

const buttonVariants = cva(
  "flex justify-center items-center py-2 px-2 rounded-lg",
  {
    variants: {
      intent: {
        primary: "bg-[#235FDF] text-white hover:bg-blue-800",
        secondary: "bg-gray-200 text-black",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
      },
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface IProps {
  intent?: ButtonVariants["intent"];
  size?: ButtonVariants["size"];
  class?: string;
}

const props = defineProps<IProps>();
const attrs = useAttrs();
</script>

<template>
  <v-button
    :class="
      cn(
        buttonVariants({ intent: props.intent, size: props.size }),
        props.class
      )
    "
    v-bind="attrs"
  >
    <slot />
  </v-button>
</template>
