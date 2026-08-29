<script setup lang="ts">
import { cn } from "@/core/libs/common";
import { computed, useAttrs } from "vue";

interface IProps {
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  class?: string;
}

const attrs = useAttrs();

const props = withDefaults(defineProps<IProps>(), {
  type: "text",
  required: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (props.type === "number") {
    const raw = target.value.replace(/\D/g, "");
    emit("update:modelValue", raw ? Number(raw) : "");
  } else {
    emit("update:modelValue", target.value);
  }
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      @input="handleInput"
      :class="
        cn(
          'px-3 py-2 border border-gray-300! rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-black',
          attrs.class
        )
      "
    />
  </div>
</template>
